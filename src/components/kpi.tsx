const kpis = [
  { label: "pending tickets", value: 10 },

  { label: "breached", value: 18 },
  { label: "about to breach", value: 18 },
  { label: "not assigned", value: 18 },
  { label: "technicians available", value: 18 },
];

const KPI = () => {
  return (
    <div className="p-4 flex gap-10 items-center">
      {kpis.map((kpi, index) => (
        <div
          className={`px-4 py-2 min-w-[200px] rounded-md border border-muted ${
            kpi.label === "technicians available" && "bg-green-600"
          } 
            ${kpi.label === "not assigned" && "bg-slate-500 "}
            ${kpi.label === "pending tickets" && "bg-yellow-500 "}
            // ${kpi.label === "raised today" && "bg-blue-500 "}
            ${kpi.label === "breached" && "bg-red-600 "} ${
            kpi.label === "about to breach" && "bg-orange-500 animate-pulse"
          }`}
          key={index}
        >
          <span>
            <p className="text-2xl font-bold">{kpi.value}</p>
            <p className="text-xs capitalize">{kpi.label}</p>
          </span>
        </div>
      ))}
    </div>
  );
};

export default KPI;
