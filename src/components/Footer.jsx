import React from 'react'

export const Footer = () => {
  return (
    <div className="w-full bg-[#111111] text-[#FAFAFA] text-center py-8 border-t-[6px] border-[#D92D20]">
      <p className="text-sm text-[#c0c0c0]">
        &copy; 2024 OneFifty. All rights reserved. | Built with React and Tailwind CSS
      </p>
      <div className="flex justify-center gap-4 mt-4">
        <a href="https://twitter.com/onefifty" className="text-[#c0c0c0] hover:text-white transition-colors text-sm">Twitter</a>
        <a href="https://facebook.com/onefifty" className="text-[#c0c0c0] hover:text-white transition-colors text-sm">Facebook</a>
        <a href="https://linkedin.com/company/onefifty" className="text-[#c0c0c0] hover:text-white transition-colors text-sm">LinkedIn</a>
      </div>
    </div>
  )
}
