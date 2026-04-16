export const Createpost = ({ onCancel }) => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-zinc-900/40 border border-white/10 p-8 rounded-sm">
        <h3 className="text-[10px] font-black uppercase tracking-[3px] text-amber-500 mb-6">Dispatch from the field</h3>
        
        <textarea
          className="w-full bg-transparent border-none text-2xl md:text-4xl font-serif placeholder-zinc-800 focus:ring-0 resize-none min-h-[200px]"
          placeholder="What's the headline?"
          autoFocus
        />
        
        <div className="flex justify-between items-center mt-8 pt-6 border-t border-white/5">
          <div className="flex gap-6 text-zinc-500">
            <button className="hover:text-white transition-colors text-[10px] font-bold">ADD SOURCE</button>
            <button className="hover:text-white transition-colors text-[10px] font-bold">ATTACH MEDIA</button>
          </div>
          
          <div className="flex gap-4">
            <button 
              onClick={onCancel}
              className="text-zinc-500 hover:text-white text-[10px] font-black uppercase tracking-widest px-4"
            >
              Discard
            </button>
            <button className="bg-white text-black px-8 py-3 text-xs font-black uppercase tracking-widest hover:bg-amber-500 transition-colors">
              PRINT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
