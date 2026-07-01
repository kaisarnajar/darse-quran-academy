import { IdCardData } from "./id-card";
import { PROCESS_IMAGE_SCRIPT } from "./html-scripts";

export function renderIdCardToHtml(data: IdCardData): string {
  return `
    <div class="w-[980px] h-[610px] relative overflow-hidden bg-[#f6f3ea] border-4 border-[#13412f] rounded-[34px] shadow-xl print:shadow-none print:border-none">
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(81,141,70,0.15),_transparent_30%),linear-gradient(135deg,_#0f3d2e_0%,_#244e35_100%)]"></div>
      <div class="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/diagmonds.png')]"></div>
      <div class="relative z-10 flex h-full flex-col p-8 text-[#0f3d2e]">
        <div class="flex items-center justify-between gap-6">
          <div class="flex items-center gap-4">
            <div class="flex h-24 w-24 items-center justify-center rounded-3xl bg-white/90 p-3 shadow-sm">
              <img src="${data.logoUrl}" alt="${data.academyName} logo" class="h-full w-full object-contain" />
            </div>
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.24em] text-[#dbbf6f]">${data.academyName}</p>
              <h1 class="text-3xl font-serif font-bold uppercase leading-tight">Student Card</h1>
            </div>
          </div>
          <div class="space-y-2 rounded-3xl bg-white/90 px-5 py-4 text-right shadow-sm">
            <p class="text-xs uppercase tracking-[0.22em] text-slate-500">Registration No.</p>
            <p class="text-lg font-semibold text-[#0f3d2e]">${data.registrationNumber}</p>
          </div>
        </div>

        <div class="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
          <div class="rounded-3xl bg-white/95 p-5 shadow-sm">
            <div class="relative overflow-hidden rounded-3xl border border-slate-200 bg-slate-50 p-2">
              <img src="${data.photoUrl}" alt="${data.name}" class="h-[260px] w-full rounded-3xl object-cover" />
              <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/55 to-transparent p-3">
                <p class="text-sm font-semibold text-white">${data.designation}</p>
              </div>
            </div>
            <div class="mt-6 rounded-3xl bg-[#0f3d2e] px-4 py-4 text-center text-white shadow-inner">
              <p class="text-xs uppercase tracking-[0.24em] text-[#b5d6b4]">Verified by</p>
              <p class="mt-2 text-sm font-semibold">Founder / CEO</p>
            </div>
          </div>

          <div class="rounded-3xl bg-white/95 p-8 shadow-sm">
            <div class="grid gap-4 text-sm text-slate-700">
              ${renderLabelValue("Name", data.name)}
              ${renderLabelValue("Father's Name", data.fatherName)}
              ${renderLabelValue("Residence", data.address)}
              ${renderLabelValue("Email", data.email)}
              ${renderLabelValue("Phone", data.phone)}
              ${renderLabelValue("Date of Birth", data.dateOfBirth)}
            </div>
            <div class="mt-10 flex items-center justify-between rounded-3xl border border-slate-200 bg-slate-50 p-5">
              <div>
                <p class="text-xs uppercase tracking-[0.24em] text-slate-500">Website</p>
                <p class="mt-1 text-sm font-semibold text-[#0f3d2e]">${data.website}</p>
              </div>
              <div class="relative w-28 overflow-hidden rounded-full bg-slate-100 p-2">
                <img src="${data.signatureUrl}" alt="signature" class="h-12 w-full object-contain" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <script>${PROCESS_IMAGE_SCRIPT}</script>
    </div>
  `;
}

function renderLabelValue(label: string, value: string) {
  return `
    <div class="grid gap-1">
      <p class="text-[10px] uppercase tracking-[0.28em] text-slate-400">${label}</p>
      <p class="text-base font-semibold text-slate-900">${value}</p>
    </div>
  `;
}
