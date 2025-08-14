(() => {
  // 입력 읽기
  let parsed;
  try { parsed = JSON.parse(parseAnalysisFromProse.data); } catch { parsed = { tasks: [] }; }
  const tasks = Array.isArray(parsed.tasks) ? parsed.tasks : [];

  let freeInfo;
  try { freeInfo = JSON.parse(computeFreeSlotsToday.data); } catch { freeInfo = { freeSlots: [], today: "" }; }
  const freeSlots = freeInfo.freeSlots || [];
  const todayStr = freeInfo.today || new Date().toISOString().slice(0,10);

  tasks.sort((a,b) => (a.order||999)-(b.order||999) || (b.isMajor - a.isMajor) || String(a.due).localeCompare(String(b.due)));

  const CHUNK_MIN = 30;   // 최소 30분
  const CHUNK_MAX = 60;   // 최대 60분
  const BUFFER    = 10;   // 작업 간 10분

  const toMin = (hhmm) => { const [h,m]=hhmm.split(":").map(Number); return h*60+m; };
  const toHHMM = (mins) => `${String(Math.floor(mins/60)).padStart(2,"0")}:${String(mins%60).padStart(2,"0")}`;

  let slots = freeSlots.map(s => [toMin(s.start), toMin(s.end)]);
  const plan = [];

  const placeChunk = (title, minutes, meta) => {
    for (let i=0;i<slots.length;i++){
      const [s,e] = slots[i];
      const avail = e - s;
      if (avail >= minutes + BUFFER) {
        const start = s;
        const end = s + minutes;
        const endWithBuf = end + BUFFER;
        plan.push({
          title,
          start: toHHMM(start),
          end: toHHMM(end),
          meta
        });

        slots[i] = [endWithBuf, e];
        if (slots[i][0] >= slots[i][1]) slots.splice(i,1);
        return true;
      }
    }
    return false;
  };

  for (const t of tasks) {
    let remain = Math.round((t.hours || 1) * 60); // 분
    while (remain > 0) {
      const chunk = Math.min(Math.max(CHUNK_MIN, Math.min(remain, CHUNK_MAX)), CHUNK_MAX);
      const ok = placeChunk(t.title, chunk, {
        isMajor: !!t.isMajor,
        due: t.due ?? null,
        estimatedMinutes: chunk,
        reason: "분석결과 기반 배치(청크)"
      });
      if (!ok) break; // 더 이상 자리가 없으면 중단
      remain -= chunk;
    }
  }

  const existing = Array.isArray(calendarData?.value) ? calendarData.value : [];
  const newEvents = plan.map(p => ({
    id: `${todayStr}-${p.title}-${p.start}`,
    title: p.title,
    start: `${todayStr}T${p.start}`,
    end:   `${todayStr}T${p.end}`,
    meta: p.meta
  }));

  const dedup = [...existing];
  for (const ev of newEvents) {
    if (!dedup.some(e => e.id === ev.id)) dedup.push(ev);
  }
  calendarData.setValue(dedup);

  const lines = plan.map(p => `⏰ ${p.start}~${p.end}  ${p.title} (${p.meta?.estimatedMinutes}분)`);
  if (typeof thisWeekText?.setValue === "function") {
    thisWeekText.setValue(["[오늘 계획 — 분석결과 기반]", ...lines].join("\n"));
  }

  return JSON.stringify({ planned: plan, unusedSlots: slots.map(([s,e]) => ({start: toHHMM(s), end: toHHMM(e)})) }, null, 2);
})();
