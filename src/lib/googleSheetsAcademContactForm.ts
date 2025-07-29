"use server";
import { google } from 'googleapis';
import { z } from "zod";

export async function appendAcademyContactFormToSheet(form: FormData) {
  try {
    const AcademyContactFormSchema = z.object({
      name: z.string().min(1, { message: "Name is required" }),
      email: z.string().email({ message: "Invalid email address" }),
      message: z.string().min(1, { message: "Message is required" }),
    });

    const formData = {
      name: form.get("name"),
      email: form.get("email"),
      message: form.get("message"),
    };

    const validatedFields = AcademyContactFormSchema.safeParse(formData);

    if (!validatedFields.success) {
      throw new Error(validatedFields.error.issues[0].message, {
        cause: 'INVALID_FORM_DATA',
      });
    }

    const { name, email, message } = validatedFields.data;

    const client_email = process.env.GOOGLE_SHEETS_CLIENT_EMAIL;
    const private_key = process.env.GOOGLE_SHEETS_PRIVATE_KEY;
    const spreadsheet_id = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    if (!client_email || !private_key || !spreadsheet_id) {
      console.error('GOOGLE_SHEETS environment variables are missing.');
      throw new Error('Server configuration error: Missing GOOGLE_SHEETS environment variable is not set.', {
        cause: 'MISSING_ENV_VARIABLES',
      });
    }

    // Google sheet setup
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: client_email,
        private_key: private_key?.replace(/\\/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });
    const sheets = google.sheets({ version: 'v4', auth });    
    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADDSHEET_ID; // Corrected typo here

    // Get the current timestamp
    const timestamp = new Date().toISOString();

    // Store in the spreadsheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet3!A:D', // Assuming columns for Timestamp, Name, Email, Message. Update if needed.
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[timestamp, name, email, message]],
      },
    });
    
    console.log('Appended academy contact form to sheet:', response.data);
    return { success: true, message: 'Academy contact form submitted successfully!' };

  } catch (e: unknown) {
    const error = e as { 
      message: string
      cause?: string
    }

    console.error('Error appending academy contact form to sheet:', (error?.cause));
    
    if (process.env.NODE_ENV === 'development') { 
      if (error?.cause === 'MISSING_ENV_VARIABLES') throw new Error('Server configuration error: Missing GOOGLE_SHEETS environment variable is not set.')   
    }
      
    if (error?.cause === 'INVALID_FORM_DATA') throw new Error(error.message)
    throw new Error("We're currently having issues with our servers. Please try again later.");
  }
} 