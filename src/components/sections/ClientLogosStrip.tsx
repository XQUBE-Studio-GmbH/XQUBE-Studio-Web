export function ClientLogosStrip() {
  // Phase 1: Static with permission-confirmed clients
  // Phase 2: Will pull from CMS (client-logos collection, permissionConfirmed: true)
  const clients = [
    { name: 'BMW', initials: 'BMW' },
    { name: 'INDG', initials: 'INDG' },
    { name: 'FlightSim Studio', initials: 'FSS' },
    { name: 'Fresh TV', initials: 'FTV' },
    { name: 'Cyberfox', initials: 'CFX' },
    { name: 'C3D', initials: 'C3D' },
    { name: 'Barney Studio', initials: 'BNY' },
  ]

  return (
    <section className="border-y border-white/[0.06] bg-[#0E0E0E]/50 py-10">
      <div className="container-xqube">
        <p className="text-center text-xs font-semibold tracking-[0.2em] uppercase text-[#8D95A8] mb-8">
          Trusted by game studios worldwide
        </p>
        <div className="flex flex-wrap items-center justify-center gap-8 lg:gap-12">
          {clients.map((client) => (
            <div
              key={client.name}
              className="flex items-center justify-center h-10 px-4 opacity-40 hover:opacity-80 transition-opacity duration-300"
              title={client.name}
            >
              {/* Phase 1: Text placeholder — Phase 2: Replace with actual logo images from CMS */}
              <span className="text-sm font-bold tracking-wider text-[#C4CAD8]">
                {client.name}
              </span>
            </div>
          ))}
        </div>
        <p className="text-center text-[10px] text-[#8D95A8]/50 mt-6">
          * Logo display subject to client permission confirmation
        </p>
      </div>
    </section>
  )
}
