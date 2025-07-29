"use server";
import { google } from 'googleapis';
import { z } from "zod";

export async function appendContactFormToSheet(form: FormData) {
  try {
    const ContactFormSchema = z.object({
      firstName: z.string().min(1, { message: "First name is required" }),
      lastName: z.string().min(1, { message: "Last name is required" }),
      email: z.string().email({ message: "Invalid email address" }),
      phoneNumber: z.string().min(1, { message: "Phone number is required" }),
      services: z.string().min(1, { message: "Please select a service" }),
      message: z.string().min(1, { message: "Message is required" }),
    });

    const formData = {
      firstName: form.get("firstName"),
      lastName: form.get("lastName"),
      email: form.get("email"),
      phoneNumber: form.get("phoneNumber"),
      services: form.get("services"),
      message: form.get("message"),
    };

    const validatedFields = ContactFormSchema.safeParse(formData);

    if (!validatedFields.success) {
      throw new Error(validatedFields.error.issues[0].message, {
        cause: 'INVALID_FORM_DATA',
      });
    }

    const { firstName, lastName, email, phoneNumber, services, message } = validatedFields.data;

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
    const SPREADSHEET_ID = process.env.GOOGLE_SHEETS_SPREADSHEET_ID;

    // Get the current timestamp
    const timestamp = new Date().toISOString();

    // Store in the spreadsheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Sheet2!A:G', // Assuming columns for Timestamp, First Name, Last Name, Email, Phone, Services, Message. Update if needed.
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[timestamp, firstName, lastName, email, phoneNumber, services, message]],
      },
    });
    
    console.log('Appended to sheet:', response.data);
    return { success: true, message: 'Contact form submitted successfully!' };

  } catch (e: unknown) {
    const error = e as { 
      message: string
      cause?: string
    }

    console.error('Error appending contact form to sheet:', (error?.cause));
    
    if (process.env.NODE_ENV === 'development') { 
      if (error?.cause === 'MISSING_ENV_VARIABLES') throw new Error('Server configuration error: Missing GOOGLE_SHEETS environment variable is not set.')   
    }
      
    if (error?.cause === 'INVALID_FORM_DATA') throw new Error(error.message)
    throw new Error("We're currently having issues with our servers. Please try again later.");
  }
} 