'use client';

import { useEffect } from 'react';
import Hotjar from '@hotjar/browser';

const HotjarInit = () => {
  useEffect(() => {
    const siteId = process.env.NEXT_PUBLIC_HOTJAR_SITE_ID;
    const hotjarVersion = 6;
    
    if (siteId) {
      Hotjar.init(Number(siteId), hotjarVersion);
    }
  }, []);

  return null;
};

export default HotjarInit;
