'use client';
import Image from 'next/image';
import { LiaCopy } from "react-icons/lia";
import Link from 'next/link';
import { useState, useCallback } from 'react';

export function Header() {
  const [address, setAddress] = useState('0x0000000000000000000000000000000000000000');
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(address).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    });
  }, [address]);

  return (
    <div
        className='fixed top-10 left-1/2 -translate-x-1/2 z-20'
      >
        <div
          className="text-center w-120 h-10 rounded-lg bg-[#661D27] relative top-0 left-1/2 -translate-x-1/2"
        >
          <div
            className='text-center w-120 h-10 rounded-lg bg-[#F17A80] relative -top-1/5 left-0 flex justify-between items-center px-4'
          >
            <div
              className='text-center text-md text-[#661D27]'
            >
             <a href="/" target="_blank" rel="noopener noreferrer" className="bg-[#691B28] hover:text-[#691B28] hover:bg-[#FBC0BA] text-[#FBC0BA] font-bold py-2 px-4 rounded-lg">
             Socials
            </a>
            </div>

            <div
              className='text-center text-md text-[#661D27] flex items-center'

            >
              <p>
                {`${address.substring(0, 3)}...${address.substring(address.length - 4)}`}
              </p>
              <LiaCopy className='cursor-pointer ml-2' onClick={handleCopy}/>
              {isCopied && <span className="ml-2 text-sm">Copied!</span>}
            </div>
          </div>
          <Link href="/">
            <Image src="/img/Typo.png" alt='header-logo' width={150} height={150} className='absolute -top-4 left-1/2 -translate-x-1/2'/>
          </Link>
        
        </div>
      </div>
  );
}

