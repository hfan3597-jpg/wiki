"use server";

import { generateText } from "ai";
import { z } from "zod";
import { deepseek } from "@/lib/ai";

const quizSchema = z.object({
  questions: z
    .array(
      z.object({
        title: z.string(),
        options: z.array(z.string()).length(4),
        correctOption: z.string(),
        explanation: z.string(),
      })
    )
    .length(10),
});

export type GeneratedQuiz = z.infer<typeof quizSchema>["questions"][number];

const categoryPrompts: Record<string, string> = {
  历史: "中国及世界历史，涵盖古代、近代的重要事件、人物、制度、文化等",
  地理: "世界自然地理与人文地理，涵盖地形地貌、气候变化、国家城市、资源分布等",
  天文: "天文学和宇宙科学，涵盖恒星行星、星系宇宙、航天探索、物理定律等",
  生活常识: "日常生活中的科学原理，涵盖物理、化学、生物、安全健康等实用知识",
};

export async function generateQuiz(category: string) {
  const domain = categoryPrompts[category] ?? `${category}领域的知识`;

  const result = await generateText({
    model: deepseek.chat("deepseek-chat"),
    temperature: 0.8,
    messages: [
      {
        role: "system",
        content: `你是一位专业的百科知识出题专家。你必须严格按照JSON格式输出，不要有任何额外的文字或markdown标记。`,
      },
      {
        role: "user",
        content: `请根据以下领域生成10道高质量的单项选择题。

领域：${domain}

出题要求：
1. 题目要有趣味性和教育意义，难度适中，面向普通大众。
2. 每道题包含4个选项，其中只有1个是正确答案。
3. 错误选项要有迷惑性，不能太过明显。
4. 解析要详细、科学、有趣，用中文撰写，100-250字，深入浅出地解释背后的科学原理或历史背景。
5. 题目之间不要重复，尽量覆盖该领域的不同子话题。

请严格按照以下JSON格式输出（只输出JSON，不要有任何其他内容）：

{
  "questions": [
    {
      "title": "题目内容",
      "options": ["选项A", "选项B", "选项C", "选项D"],
      "correctOption": "正确选项（必须与options中的一项完全一致）",
      "explanation": "详细科学原理解析（中文100-250字）"
    }
  ]
}`,
      },
    ],
  });

  // Extract JSON from the response (handle potential markdown code blocks)
  let text = result.text.trim();

  // Remove markdown code block markers if present
  const jsonMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (jsonMatch) {
    text = jsonMatch[1].trim();
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error(`AI 返回的不是有效的 JSON 格式。原始响应: ${text.slice(0, 200)}...`);
  }

  const validated = quizSchema.safeParse(parsed);

  if (!validated.success) {
    const errors = validated.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`AI 返回的数据格式不符合要求: ${errors}`);
  }

  return validated.data.questions;
}
