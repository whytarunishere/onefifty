import React from 'react'

export const Footer = () => {
  return (
    <div className="w-full bg-black text-white text-center py-6">
      <p className="text-sm text-zinc-500">
        &copy; 2024 OneFifty. All rights reserved. | Built with React and Tailwind CSS
      </p>
      <div className="flex justify-center gap-4 mt-4">
        <a href="https://twitter.com/onefifty" className="text-zinc-500 hover:text-white transition-colors text-sm">Twitter</a>
        <a href="https://facebook.com/onefifty" className="text-zinc-500 hover:text-white transition-colors text-sm">Facebook</a>
        <a href="https://linkedin.com/company/onefifty" className="text-zinc-500 hover:text-white transition-colors text-sm">LinkedIn</a>
      </div>
    </div>
  )
}
