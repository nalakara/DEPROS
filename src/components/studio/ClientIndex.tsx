import React from "react";
import { ClientItem } from "@/lib/types";
import { NOTABLE_CLIENTS } from "@/lib/data";

interface ClientIndexProps {
  clients?: ClientItem[];
}

export const ClientIndex: React.FC<ClientIndexProps> = ({
  clients = NOTABLE_CLIENTS,
}) => {
  return (
    <section className="py-16 sm:py-24 bg-white border-t border-depros-border">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Section Header (Reflecting DEPROS PDF Page 3) */}
        <div className="border-b border-depros-black pb-4 mb-8 flex items-baseline justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-depros-orange text-white text-[11px] font-sans font-bold px-2.5 py-0.5 uppercase tracking-widest">
              Notable Clients
            </span>
          </div>
          <div className="text-xs font-mono text-depros-muted tracking-widest" aria-hidden="true">
            . + o
          </div>
        </div>

        {/* Client Table with clean hairlines */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-depros-border text-[11px] font-sans uppercase tracking-widest text-depros-muted">
                <th className="py-3.5 px-3 font-medium">Client</th>
                <th className="py-3.5 px-3 font-medium">Scope of Work</th>
                <th className="py-3.5 px-3 font-medium">Industry</th>
                <th className="py-3.5 px-3 font-medium">Location</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-depros-border/60 text-xs sm:text-sm font-sans">
              {clients.map((client, idx) => (
                <tr
                  key={client.id}
                  className="hover:bg-depros-light/60 transition-colors duration-150 group"
                >
                  <td className="py-3.5 px-3 font-bold text-depros-black group-hover:text-depros-orange transition-colors">
                    <span className="text-depros-orange font-mono font-medium text-xs mr-2">
                      {String(idx + 1).padStart(2, "0")}.
                    </span>
                    {client.name}
                  </td>
                  <td className="py-3.5 px-3 text-depros-black/85 font-normal">
                    {client.scope}
                  </td>
                  <td className="py-3.5 px-3 text-depros-muted font-normal">
                    {client.industry}
                  </td>
                  <td className="py-3.5 px-3 text-depros-muted font-normal">
                    {client.location}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
};
