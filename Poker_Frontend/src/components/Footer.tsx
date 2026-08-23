export const Footer = () => (
  <footer className="border-t border-white/[0.07] bg-black pt-20 pb-10">
    <div className="max-w-7xl mx-auto px-6 lg:px-8">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="md:col-span-1">
          <a href="#" className="text-xl font-bold tracking-tighter text-white mb-4 block">
            Pokerr.
          </a>
          <p className="text-white/40 text-sm leading-relaxed max-w-xs">
            The first truly immersive online poker platform with real-time video and spatial voice chat.
          </p>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-6">Product</h4>
          <ul className="flex flex-col gap-4">
            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Cash Games</a></li>
            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Tournaments</a></li>
            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Video Chat</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-6">Company</h4>
          <ul className="flex flex-col gap-4">
            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">About</a></li>
            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Careers</a></li>
            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Contact</a></li>
          </ul>
        </div>
        <div>
          <h4 className="text-white text-sm font-semibold mb-6">Legal</h4>
          <ul className="flex flex-col gap-4">
            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Terms of Service</a></li>
            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Privacy Policy</a></li>
            <li><a href="#" className="text-white/40 hover:text-white text-sm transition-colors">Responsible Gaming</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/[0.07] pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/25 text-sm">&copy; 2026 Pokerr. All rights reserved.</p>
        <div className="flex items-center gap-6">
          <a href="#" className="text-white/25 hover:text-white text-sm transition-colors">Twitter</a>
          <a href="#" className="text-white/25 hover:text-white text-sm transition-colors">Discord</a>
          <a href="#" className="text-white/25 hover:text-white text-sm transition-colors">GitHub</a>
        </div>
      </div>
    </div>
  </footer>
);
