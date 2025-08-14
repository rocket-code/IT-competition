{{
(() => {
  // 1) 시간표(JSON Editor) 원본
  const schedule = Array.isArray(scheduleJson.value) ? scheduleJson.value : [];

  const rows = (table1.selectedRows && table1.selectedRows.length > 0)
    ? table1.selectedRows
    : (table1.data || []);

  const tasks = rows.map(r => ({
    title: r["과제명"] ?? r.title ?? "",
    type: r["과제유형"] ?? r.type ?? "",
    hours: Number(r["소요시간"] ?? r.hours ?? 0),
    isMajor: !!(r["전공유무"] ?? r.isMajor ?? false),
    due: (() => {
      const d = new Date(r["마감기한"] ?? r.due ?? "");
      return isNaN(d) ? null : d.toISOString().slice(0,10); // YYYY-MM-DD
    })(),
    priority: Number(r["우선순위"] ?? r.priority ?? 0)
  }));

  return `
[context]
today: ${new Date().toISOString().slice(0,10)}

[schedule_json]
${JSON.stringify(schedule, null, 2)}

[tasks_json]
${JSON.stringify(tasks, null, 2)}

[instruction]
- 위 시간표와 과제 목록을 함께 고려해 오늘/내일의 자투리 시간에 무엇을 하면 좋을지 3~5개로 제안.
- 마감 임박/우선순위/소요시간(<= 남는 시간)에 맞춰 추천.
- 형식: 번호 목록 + 근거(마감일·예상 소요시간·전공 여부).
`;
})()
}}
