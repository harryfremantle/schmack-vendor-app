import { PrismaClient, BillingCadence, BillingType, AllocationMode, RecordStatus } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
  await prisma.vendorAssignment.deleteMany();
  await prisma.vendorTagOnVendor.deleteMany();
  await prisma.vendor.deleteMany();
  await prisma.employeeTeam.deleteMany();
  await prisma.employee.deleteMany();
  await prisma.team.deleteMany();
  await prisma.country.deleteMany();
  await prisma.vendorTag.deleteMany();
  await prisma.exchangeRateCache.deleteMany();
  await prisma.appSetting.deleteMany();
  const [operations, creative, ai, solutions] = await Promise.all([
    prisma.team.create({ data: { name: "Operations" } }),
    prisma.team.create({ data: { name: "Creative" } }),
    prisma.team.create({ data: { name: "AI" } }),
    prisma.team.create({ data: { name: "Solutions" } })
  ]);
  const [de, uk, pl, nl] = await Promise.all([
    prisma.country.create({ data: { code: "DE", name: "Germany" } }),
    prisma.country.create({ data: { code: "GB", name: "United Kingdom" } }),
    prisma.country.create({ data: { code: "PL", name: "Poland" } }),
    prisma.country.create({ data: { code: "NL", name: "Netherlands" } })
  ]);
  const employees = await Promise.all([
    prisma.employee.create({ data: { name: "Harry Fremantle", email: "harry@schmack.agency", title: "Head of Operations", countryId: uk.id, teams: { create: [{ teamId: operations.id }] } } }),
    prisma.employee.create({ data: { name: "Ben Koolen", email: "ben@schmack.agency", title: "Solutions Lead", countryId: nl.id, teams: { create: [{ teamId: solutions.id }, { teamId: ai.id }] } } }),
    prisma.employee.create({ data: { name: "Anna Madeleine", email: "anna@schmack.agency", title: "Creative Operations", countryId: de.id, teams: { create: [{ teamId: creative.id }] } } }),
    prisma.employee.create({ data: { name: "Sebastian Wangerud", email: "sebastian@schmack.agency", title: "Operations", countryId: de.id, teams: { create: [{ teamId: operations.id }] } } })
  ]);
  const tags = await Promise.all([
    prisma.vendorTag.create({ data: { name: "Operations", color: "slate" } }),
    prisma.vendorTag.create({ data: { name: "Creative", color: "purple" } }),
    prisma.vendorTag.create({ data: { name: "AI", color: "emerald" } }),
    prisma.vendorTag.create({ data: { name: "Solutions", color: "amber" } }),
    prisma.vendorTag.create({ data: { name: "Security", color: "red" } })
  ]);
  const vendorData = [
    { name: "Slack", ownerId: employees[3].id, billingType: BillingType.PER_SEAT, billingCadence: BillingCadence.MONTHLY, nativeCurrency: "USD", seatPrice: 9, seatsPurchased: 27, renewalDate: new Date("2026-06-01"), tagNames: ["Operations"] },
    { name: "Jira", ownerId: employees[0].id, billingType: BillingType.PER_SEAT, billingCadence: BillingCadence.MONTHLY, nativeCurrency: "USD", seatPrice: 17, seatsPurchased: 26, renewalDate: new Date("2026-05-13"), tagNames: ["Operations"] },
    { name: "Confluence", ownerId: employees[0].id, billingType: BillingType.PER_SEAT, billingCadence: BillingCadence.MONTHLY, nativeCurrency: "USD", seatPrice: 6.4, seatsPurchased: 26, renewalDate: new Date("2026-05-13"), tagNames: ["Operations"] },
    { name: "Toggl", ownerId: employees[0].id, billingType: BillingType.PER_SEAT, billingCadence: BillingCadence.MONTHLY, nativeCurrency: "USD", seatPrice: 20, seatsPurchased: 27, renewalDate: new Date("2026-05-13"), tagNames: ["Operations"] },
    { name: "Miro", ownerId: employees[0].id, billingType: BillingType.PER_SEAT, billingCadence: BillingCadence.MONTHLY, nativeCurrency: "USD", seatPrice: 20, seatsPurchased: 22, renewalDate: new Date("2026-05-28"), tagNames: ["Operations", "Creative"] },
    { name: "NordVPN", ownerId: employees[0].id, billingType: BillingType.PER_SEAT, billingCadence: BillingCadence.ANNUAL, nativeCurrency: "USD", seatPrice: 14, seatsPurchased: 21, renewalDate: new Date("2027-04-02"), tagNames: ["Operations", "Security"] },
    { name: "ChatGPT", ownerId: employees[1].id, billingType: BillingType.PER_SEAT, billingCadence: BillingCadence.MONTHLY, nativeCurrency: "USD", seatPrice: 30, seatsPurchased: 15, renewalDate: new Date("2026-06-26"), tagNames: ["Solutions", "AI"] },
    { name: "Canva", ownerId: employees[2].id, billingType: BillingType.PER_SEAT, billingCadence: BillingCadence.ANNUAL, nativeCurrency: "USD", seatPrice: 59.7, seatsPurchased: 2, renewalDate: new Date("2026-07-28"), tagNames: ["Creative"] },
    { name: "Figma", ownerId: employees[0].id, billingType: BillingType.PER_SEAT, billingCadence: BillingCadence.MONTHLY, nativeCurrency: "USD", seatPrice: 20, seatsPurchased: 7, renewalDate: new Date("2026-05-27"), tagNames: ["Creative"] },
    { name: "Google Workspace", ownerId: employees[3].id, billingType: BillingType.PER_SEAT, billingCadence: BillingCadence.MONTHLY, nativeCurrency: "EUR", seatPrice: 18.31, seatsPurchased: 28, renewalDate: new Date("2026-06-01"), tagNames: ["Operations"] },
    { name: "Miradore", ownerId: employees[0].id, billingType: BillingType.FIXED, billingCadence: BillingCadence.ANNUAL, nativeCurrency: "EUR", fixedAmount: 0, seatsPurchased: 19, renewalDate: new Date("2027-03-02"), tagNames: ["Operations"], allocationMode: AllocationMode.EQUAL_SPLIT }
  ];
  for (const vendor of vendorData) {
    const created = await prisma.vendor.create({ data: { name: vendor.name, ownerId: vendor.ownerId, billingType: vendor.billingType, billingCadence: vendor.billingCadence, nativeCurrency: vendor.nativeCurrency, seatPrice: vendor.seatPrice, seatsPurchased: vendor.seatsPurchased, fixedAmount: vendor.fixedAmount, renewalDate: vendor.renewalDate, allocationMode: vendor.allocationMode ?? AllocationMode.NONE, status: RecordStatus.ACTIVE } });
    for (const tagName of vendor.tagNames) {
      const tag = tags.find((t) => t.name === tagName);
      if (tag) await prisma.vendorTagOnVendor.create({ data: { vendorId: created.id, tagId: tag.id } });
    }
  }
  const allVendors = await prisma.vendor.findMany();
  const byName = Object.fromEntries(allVendors.map((v) => [v.name, v]));
  const assignments = [["Slack", employees[0].id], ["Slack", employees[1].id], ["Slack", employees[2].id], ["Slack", employees[3].id], ["Jira", employees[0].id], ["Jira", employees[3].id], ["Confluence", employees[0].id], ["Confluence", employees[3].id], ["Toggl", employees[0].id], ["Toggl", employees[2].id], ["Miro", employees[0].id], ["Miro", employees[2].id], ["Miro", employees[3].id], ["NordVPN", employees[1].id], ["NordVPN", employees[3].id], ["ChatGPT", employees[0].id], ["ChatGPT", employees[1].id], ["ChatGPT", employees[3].id], ["Canva", employees[2].id], ["Figma", employees[2].id], ["Figma", employees[0].id], ["Google Workspace", employees[0].id], ["Google Workspace", employees[1].id], ["Google Workspace", employees[2].id], ["Google Workspace", employees[3].id]] as const;
  for (const [vendorName, employeeId] of assignments) await prisma.vendorAssignment.create({ data: { vendorId: byName[vendorName].id, employeeId } });
  await prisma.exchangeRateCache.createMany({ data: [
    { baseCurrency: "USD", quoteCurrency: "EUR", rate: 0.92 }, { baseCurrency: "EUR", quoteCurrency: "USD", rate: 1.09 },
    { baseCurrency: "GBP", quoteCurrency: "EUR", rate: 1.17 }, { baseCurrency: "EUR", quoteCurrency: "GBP", rate: 0.85 },
    { baseCurrency: "USD", quoteCurrency: "GBP", rate: 0.78 }, { baseCurrency: "GBP", quoteCurrency: "USD", rate: 1.28 }
  ] });
  await prisma.appSetting.create({ data: { defaultReportingCurrency: "EUR" } });
}
main().then(async () => { await prisma.$disconnect(); }).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
