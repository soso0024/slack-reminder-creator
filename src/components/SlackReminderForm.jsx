import React, { useState } from "react";
import { Calendar, Globe } from "lucide-react";

// 言語リソース
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
    userPlaceholder: "username",
    channelPlaceholder: "channel",
    copied: "Copied!",
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
    userPlaceholder: "ユーザー名",
    channelPlaceholder: "チャンネル名",
    copied: "コピーしました！",
  },
};

const SlackReminderForm = () => {
  const [target, setTarget] = useState("me");
  const [targetType, setTargetType] = useState("self");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [customTarget, setCustomTarget] = useState("");
  const [language, setLanguage] = useState("ja"); // デフォルトを日本語に設定
  const [showCopied, setShowCopied] = useState(false);

  const t = translations[language];

  // Slackコマンドの生成
  const generateCommand = () => {
    let targetStr = target;
    if (targetType === "user" && customTarget) {
      targetStr = `@${customTarget}`;
    } else if (targetType === "channel" && customTarget) {
      targetStr = `#${customTarget}`;
    }

    return `/remind ${targetStr} "${message}" at ${time} on ${date}`;
  };

  // クリップボードにコピー
  const copyToClipboard = () => {
    navigator.clipboard.writeText(generateCommand());
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 2000);
  };

  // 言語切り替え
  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ja" : "en");
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

      {/* 日付と時間の選択 */}
      <div className="mb-6 grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">{t.date}</label>
          <div className="relative">
            <Calendar className="absolute left-2 top-2.5 h-5 w-5 text-gray-400" />
            <input
              type="date"
              className="w-full p-2 pl-10 border rounded"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">{t.time}</label>
          <input
            type="time"
            className="w-full p-2 border rounded"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
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

        {/* コピー完了メッセージ */}
        {showCopied && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black text-white px-3 py-1 rounded">
            {t.copied}
          </div>
        )}
      </div>
    </div>
  );
};

export default SlackReminderForm;
