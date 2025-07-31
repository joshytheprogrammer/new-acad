'use client';

import { useEffect } from 'react';
import Hotjar from '@hotjar/browser';

const HotjarInit = () => {
  useEffect(() => {
    const siteId = 6481039;
    const hotjarVersion = 6;
    
    Hotjar.init(siteId, hotjarVersion);
  }, []);

  return null;
};

export default HotjarInit;
