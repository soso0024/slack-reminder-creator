import React, { useState } from "react";
import { Calendar, Globe, RefreshCw } from "lucide-react";

const translations = {
  en: {
    title: "Slack Reminder Creator",
    sendTo: "Send to:",
    me: "Me",
    user: "User",
    channel: "Channel",
    message: "Message:",
    messagePlaceholder: "Enter your reminder message",
    date: "Date:",
    time: "Time:",
    commandPreview: "Command Preview:",
    copyButton: "Copy to Clipboard",
    userPlaceholder: "@username",
    channelPlaceholder: "#channel",
    copied: "Copied!",
    repeat: "Repeat",
    once: "Once",
    interval: "Interval",
    every: {
      day: "Every day",
      week: "Every week",
      biweekly: "Every 2 weeks",
      month: "Every month",
      year: "Every year",
    },
    weekdays: {
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri",
      sat: "Sat",
      sun: "Sun",
    },
    dayTypes: {
      weekday: "Weekday",
      weekend: "Weekend",
    },
  },
  ja: {
    title: "Slack リマインド作成",
    sendTo: "送信先:",
    me: "自分",
    user: "ユーザー",
    channel: "チャンネル",
    message: "メッセージ:",
    messagePlaceholder: "リマインドメッセージを入力してください",
    date: "日付:",
    time: "時間:",
    commandPreview: "コマンドプレビュー:",
    copyButton: "クリップボードにコピー",
    userPlaceholder: "@ユーザー名",
    channelPlaceholder: "#チャンネル名",
    copied: "コピーしました！",
    repeat: "繰り返し",
    once: "1回のみ",
    interval: "間隔",
    every: {
      day: "毎日",
      week: "毎週",
      biweekly: "隔週",
      month: "毎月",
      year: "毎年",
    },
    weekdays: {
      mon: "月",
      tue: "火",
      wed: "水",
      thu: "木",
      fri: "金",
      sat: "土",
      sun: "日",
    },
    dayTypes: {
      weekday: "平日",
      weekend: "休日",
    },
  },
};

const weekdays = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];
const weekdayNames = {
  mon: "Monday",
  tue: "Tuesday",
  wed: "Wednesday",
  thu: "Thursday",
  fri: "Friday",
  sat: "Saturday",
  sun: "Sunday",
};

const repeatOptions = {
  none: "",
  daily: "every day",
  weekly: "every week",
  biweekly: "every 2 weeks",
  monthly: "every month",
  yearly: "every year",
};

export default function SlackReminderForm() {
  const [target, setTarget] = useState("me");
  const [targetType, setTargetType] = useState("self");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [customTarget, setCustomTarget] = useState("");
  const [language, setLanguage] = useState("ja");
  const [showCopied, setShowCopied] = useState(false);
  const [repeatInterval, setRepeatInterval] = useState("none");
  const [selectedDays, setSelectedDays] = useState([]);

  const t = translations[language];

  const generateCommand = () => {
    let targetStr = target;
    if (targetType === "user" && customTarget) {
      targetStr = `@${customTarget}`;
    } else if (targetType === "channel" && customTarget) {
      targetStr = `#${customTarget}`;
    }

    let command = `/remind ${targetStr} "${message}"`;

    if (repeatInterval === "none") {
      command += ` at ${time} on ${date}`;
    } else if (selectedDays.length > 0) {
      const daysStr = selectedDays.map((day) => weekdayNames[day]).join(",");
      command += ` at ${time} every ${daysStr}`;
    } else {
      command += ` at ${time} ${repeatOptions[repeatInterval]}`;
    }

    return command;
  };

  const toggleDay = (day) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const selectDayType = (type) => {
    if (type === "weekday") {
      setSelectedDays(["mon", "tue", "wed", "thu", "fri"]);
    } else if (type === "weekend") {
      setSelectedDays(["sat", "sun"]);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCommand());
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "ja" : "en"));
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">{t.title}</h1>
        <button
          onClick={toggleLanguage}
          className="flex items-center gap-2 px-3 py-1 rounded bg-gray-100 hover:bg-gray-200"
        >
          <Globe className="h-4 w-4" />
          {language === "en" ? "日本語" : "English"}
        </button>
      </div>

      {/* 送信先の選択 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">{t.sendTo}</label>
        <div className="flex gap-4 mb-2">
          <button
            className={`px-4 py-2 rounded ${
              targetType === "self" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => {
              setTargetType("self");
              setTarget("me");
            }}
          >
            {t.me}
          </button>
          <button
            className={`px-4 py-2 rounded ${
              targetType === "user" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTargetType("user")}
          >
            {t.user}
          </button>
          <button
            className={`px-4 py-2 rounded ${
              targetType === "channel"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
            onClick={() => setTargetType("channel")}
          >
            {t.channel}
          </button>
        </div>

        {targetType !== "self" && (
          <input
            type="text"
            className="w-full p-2 border rounded"
            placeholder={
              targetType === "user" ? t.userPlaceholder : t.channelPlaceholder
            }
            value={customTarget}
            onChange={(e) => setCustomTarget(e.target.value)}
          />
        )}
      </div>

      {/* メッセージ入力 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">{t.message}</label>
        <textarea
          className="w-full p-2 border rounded"
          rows="3"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t.messagePlaceholder}
        />
      </div>

      {/* 繰り返し設定 */}
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">
          <RefreshCw className="inline h-4 w-4 mr-2" />
          {t.repeat}
        </label>
        <div className="flex gap-4 mb-4">
          <select
            className="w-full p-2 border rounded bg-white"
            value={repeatInterval}
            onChange={(e) => setRepeatInterval(e.target.value)}
          >
            <option value="none">{t.once}</option>
            <option value="daily">{t.every.day}</option>
            <option value="weekly">{t.every.week}</option>
            <option value="biweekly">{t.every.biweekly}</option>
            <option value="monthly">{t.every.month}</option>
            <option value="yearly">{t.every.year}</option>
          </select>
        </div>

        {/* 曜日選択 */}
        {repeatInterval !== "none" && repeatInterval !== "daily" && (
          <div className="mb-4">
            {/* 平日/休日選択ボタン */}
            <div className="flex gap-2 mb-4">
              <button
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => selectDayType("weekday")}
              >
                {t.dayTypes.weekday}
              </button>
              <button
                className="px-4 py-2 rounded bg-gray-100 hover:bg-gray-200"
                onClick={() => selectDayType("weekend")}
              >
                {t.dayTypes.weekend}
              </button>
            </div>

            {/* 曜日選択ボタン */}
            <div className="flex flex-wrap gap-2">
              {weekdays.map((day) => (
                <button
                  key={day}
                  onClick={() => toggleDay(day)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center
                    ${
                      selectedDays.includes(day)
                        ? "bg-blue-500 text-white"
                        : "bg-gray-100"
                    }`}
                >
                  {t.weekdays[day]}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* 日付と時間の設定 */}
      <div className="mb-6">
        <div className="grid grid-cols-2 gap-4">
          {repeatInterval === "none" && (
            <div>
              <label className="block text-sm font-medium mb-2">
                <Calendar className="inline h-4 w-4 mr-2" />
                {t.date}
              </label>
              <input
                type="date"
                className="w-full p-2 border rounded"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          )}
          <div className={repeatInterval === "none" ? "" : "col-span-2"}>
            <label className="block text-sm font-medium mb-2">{t.time}</label>
            <input
              type="time"
              className="w-full p-2 border rounded"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* プレビューとコピー */}
      <div className="bg-gray-50 p-4 rounded mb-4">
        <label className="block text-sm font-medium mb-2">
          {t.commandPreview}
        </label>
        <code className="block p-2 bg-gray-100 rounded">
          {generateCommand()}
        </code>
      </div>

      <div className="relative">
        <button
          onClick={copyToClipboard}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
        >
          {t.copyButton}
        </button>

        {showCopied && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white px-3 py-1 rounded">
            {t.copied}
          </div>
        )}
      </div>
    </div>
  );
}
