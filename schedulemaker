const data = scheduleJson.value || [];

const subject = subjectInput.value;
const day = dayInput.value;
const start = new Date(startTime.value);
const end = new Date(endTime.value);

const dayMap = { "월": 1, "화": 2, "수": 3, "목": 4, "금": 5 };
const dayEmojiMap = { "월": "🟥", "화": "🟧", "수": "🟨", "목": "🟦", "금": "🟩" };

if (!subject || !day || !start || !end) {
  utils.showNotification({
    title: "⚠️ 입력 오류",
    description: "모든 항목을 입력해주세요!",
    notificationType: "error"
  });
  return;
}

data.push({
  subject,
  day,
  start: start.toISOString(),
  end: end.toISOString()
});
scheduleJson.setValue(data);

const grid = [];
for (let i = 0; i < 13; i++) {
  const hour = String(9 + i).padStart(2, '0') + ":00";
  grid.push([hour, "", "", "", "", ""]);  // [시간, 월, 화, 수, 목, 금]
}

function fixWidth(text, len) {
  const full = text || "";
  const clean = full.replace(/[^\x00-\xff]/g, "**"); // 한글은 2칸으로 계산
  const padding = len - clean.length;
  return full + " ".repeat(padding > 0 ? padding : 0);
}

for (const item of data) {
  const col = dayMap[item.day]; // 1~5 (월~금)
  if (col === undefined) continue;

  const emoji = dayEmojiMap[item.day] || "";
  const displayText = `${emoji} ${item.subject}`;

  const startHour = new Date(item.start).getHours();
  const endHour = new Date(item.end).getHours();

  for (let h = startHour; h < endHour; h++) {
    const row = h - 9;
    if (row >= 0 && row < grid.length) {
      grid[row][col] = displayText;
    }
  }
}


let result = "시간        월                  화                   수                  목                  금";
result += "\n" + "-".repeat(70); // 👈 줄 간격 조정됨

for (const row of grid) {
  result += `\n${fixWidth(row[0], 12)}${fixWidth(row[1], 18)}${fixWidth(row[2], 19)}${fixWidth(row[3], 18)}${fixWidth(row[4], 18)}${fixWidth(row[5], 18)}`;
}

const tip = "\n\n💡 팁: 등록된 수업을 수정하고 싶을 땐 '전체 삭제' 후 다시 등록해 주세요!";
textArea3.setValue(result + tip);
