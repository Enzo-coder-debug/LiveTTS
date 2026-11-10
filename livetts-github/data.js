window.LIVETTS_DATA = {
  "categories": [
    {
      "id": "zeroshot",
      "en": "Voice continuity",
      "zh": "音色延续"
    },
    {
      "id": "expression",
      "en": "Expressive speech",
      "zh": "情感与副语言"
    },
    {
      "id": "languages",
      "en": "Cross-lingual",
      "zh": "跨语种"
    },
    {
      "id": "dialects",
      "en": "Chinese dialects",
      "zh": "地方方言"
    },
    {
      "id": "longform",
      "en": "Long-form",
      "zh": "长文本"
    },
    {
      "id": "specialty",
      "en": "Phonetics",
      "zh": "拼音教学"
    },
    {
      "id": "scenarios",
      "en": "Use cases",
      "zh": "应用场景"
    }
  ],
  "samples": [
    {
      "id": "one-voice",
      "category": "zeroshot",
      "title": {
        "en": "One voice, two languages",
        "zh": "一个音色，中英表达"
      },
      "description": {
        "zh": "同一指定预置音色合成新的中英文文本，不是零样本克隆或参考音频对照。",
        "en": "New Chinese and English text synthesized with one selected preset voice, not a zero-shot cloning or reference-audio comparison."
      },
      "tags": [
        "PRESET VOICE",
        "ZH / EN"
      ],
      "reference": {
        "src": "",
        "transcript": "",
        "label": {
          "en": "Reference voice",
          "zh": "参考音色"
        }
      },
      "outputs": [
        {
          "label": {
            "en": "Mandarin · Everyday moments",
            "zh": "普通话 · 日常片刻"
          },
          "language": "zh-CN",
          "text": "今天的风刚刚好。忙完手头的事，就去楼下走走吧，给自己留一点慢下来的时间。",
          "src": "./assets/audio/peach-20261110/one-voice-zh.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "English · A little wonder",
            "zh": "英语 · 一点小小的惊喜"
          },
          "language": "en",
          "text": "Some ideas are better heard than read. A quiet story, a familiar greeting, a thought that makes you smile.",
          "src": "./assets/audio/peach-20261110/one-voice-en.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=en · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        }
      ]
    },
    {
      "id": "emotional-range",
      "category": "expression",
      "title": {
        "zh": "六种情绪，六段表达",
        "en": "Six emotions, six moments"
      },
      "description": {
        "zh": "为不同情绪搭配相应文案，展示同一音色的表达变化；这不是固定文本的情感对照实验。",
        "en": "Each emotion has its own script, illustrating delivery with one voice rather than a controlled same-text comparison."
      },
      "tags": [
        "INSTRUCTION",
        "EMOTION"
      ],
      "reference": {
        "src": "",
        "transcript": "",
        "label": {
          "en": "Shared voice reference",
          "zh": "共同参考音色"
        }
      },
      "outputs": [
        {
          "label": {
            "en": "Warm",
            "zh": "温暖"
          },
          "language": "zh-CN",
          "text": "别着急，你已经做得很好了。今天的事情就先放一放，喝口热水，慢慢来，我会一直陪着你。",
          "src": "./assets/audio/peach-20261110/emotion-warm.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=温暖 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Excited",
            "zh": "高兴"
          },
          "language": "zh-CN",
          "text": "太好了，我们终于成功啦！这么多天的努力没有白费，今晚一定要好好庆祝一下，把这个好消息告诉大家！",
          "src": "./assets/audio/peach-20261110/emotion-excited.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=高兴 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Sad",
            "zh": "悲伤"
          },
          "language": "zh-CN",
          "text": "我还以为，明天还能像往常一样见到你。可房间已经空了，只剩下那杯没有喝完的茶，静静地放在桌上。",
          "src": "./assets/audio/peach-20261110/emotion-sad.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=悲伤 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Neutral",
            "zh": "中立"
          },
          "language": "zh-CN",
          "text": "本次会议将于明天上午十点开始，地点在三楼会议室。请各位提前五分钟到场，并携带相关资料。",
          "src": "./assets/audio/peach-20261110/emotion-neutral.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Angry",
            "zh": "愤怒"
          },
          "language": "zh-CN",
          "text": "你明明答应过会认真检查，为什么还是把这么重要的事情忘了？这不是一句对不起就能解决的，请你现在就给我一个解释！",
          "src": "./assets/audio/peach-20261110/emotion-angry.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=愤怒 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Fearful",
            "zh": "恐惧"
          },
          "language": "zh-CN",
          "text": "等一下，你听见了吗？门外好像有人在走动。可是这栋楼里应该只有我们。别出声，先把灯关掉。",
          "src": "./assets/audio/peach-20261110/emotion-fearful.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=恐惧 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        }
      ]
    },
    {
      "id": "audio-tags",
      "category": "expression",
      "title": {
        "en": "The things between the words.",
        "zh": "文字之外，也有表达。"
      },
      "description": {
        "en": "Paralinguistic cues such as laughter and sighs, embedded directly in text.",
        "zh": "在文字中插入大笑、叹气等副语言标签。"
      },
      "tags": [
        "AUDIO TAGS",
        "ZH"
      ],
      "reference": {
        "src": "",
        "transcript": "",
        "label": {
          "en": "Voice reference",
          "zh": "参考音色"
        }
      },
      "outputs": [
        {
          "label": {
            "en": "Laughter & sigh",
            "zh": "大笑与叹气"
          },
          "language": "zh-CN",
          "text": "他听完愣了一下，<laughter>然后摇了摇头<sigh>。",
          "src": "./assets/audio/peach-20261110/audio-tags-output.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Laughter",
            "zh": "大笑"
          },
          "language": "zh-CN",
          "text": "你这个主意也太有意思了！<laughter>好，就这么说定了。",
          "src": "./assets/audio/peach-20261110/tag-laughter.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Sigh",
            "zh": "叹气"
          },
          "language": "zh-CN",
          "text": "今天忙了一整天。<sigh>终于可以坐下来，安安静静地喝杯茶了。",
          "src": "./assets/audio/peach-20261110/tag-sigh.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Throat clearing",
            "zh": "清嗓"
          },
          "language": "zh-CN",
          "text": "<throat>各位来宾，大家下午好。欢迎来到今天的分享会。",
          "src": "./assets/audio/peach-20261110/tag-throat.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        }
      ]
    },
    {
      "id": "across-languages",
      "category": "languages",
      "title": {
        "en": "One voice, across languages.",
        "zh": "跨越语言，还是同一个你。"
      },
      "description": {
        "en": "Explore pronunciation and speaker identity across language boundaries.",
        "zh": "在不同语言之间，观察发音表现与原始音色保持。"
      },
      "tags": [
        "CROSS-LINGUAL",
        "VOICE IDENTITY"
      ],
      "reference": {
        "src": "",
        "transcript": "",
        "label": {
          "en": "Shared voice reference",
          "zh": "共同参考音色"
        }
      },
      "outputs": [
        {
          "label": {
            "en": "English",
            "zh": "英语"
          },
          "language": "en",
          "text": "Every new day is a chance to discover something beautiful. Let's take the first step together.",
          "src": "./assets/audio/peach-20261110/language-en.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=en · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Japanese",
            "zh": "日语"
          },
          "language": "ja",
          "text": "新しい一日が始まります。今日は、どんな素敵なことに出会えるでしょう。",
          "src": "./assets/audio/peach-20261110/language-ja.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=ja · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Chinese + English",
            "zh": "中英混合"
          },
          "language": "zh-CN",
          "text": "Welcome to a brand new day. 今天，也给自己一个小小的期待。Let’s make it a good one.",
          "src": "./assets/audio/peach-20261110/language-mixed.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "German",
            "zh": "德语"
          },
          "language": "de",
          "text": "Jeder neue Tag ist eine Gelegenheit, etwas Schönes zu entdecken. Machen wir gemeinsam den ersten Schritt.",
          "src": "./assets/audio/peach-20261110/language-de.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=de · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "French",
            "zh": "法语"
          },
          "language": "fr",
          "text": "Chaque nouveau jour est une occasion de découvrir quelque chose de beau. Faisons le premier pas ensemble.",
          "src": "./assets/audio/peach-20261110/language-fr.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=fr · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Spanish",
            "zh": "西班牙语"
          },
          "language": "es",
          "text": "Cada nuevo día es una oportunidad para descubrir algo hermoso. Demos juntos el primer paso.",
          "src": "./assets/audio/peach-20261110/language-es.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=es · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Dutch",
            "zh": "荷兰语"
          },
          "language": "nl",
          "text": "Elke nieuwe dag is een kans om iets moois te ontdekken. Laten we samen de eerste stap zetten.",
          "src": "./assets/audio/peach-20261110/language-nl.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=nl · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Korean",
            "zh": "韩语"
          },
          "language": "ko",
          "text": "새로운 하루는 아름다운 무언가를 발견할 기회입니다. 함께 첫걸음을 내디뎌 볼까요?",
          "src": "./assets/audio/peach-20261110/language-ko.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=ko · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Arabic",
            "zh": "阿拉伯语"
          },
          "language": "ar",
          "text": "كل يوم جديد هو فرصة لاكتشاف شيء جميل. لنخطُ الخطوة الأولى معًا.",
          "src": "./assets/audio/peach-20261110/language-ar.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=ar · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Indonesian",
            "zh": "印尼语"
          },
          "language": "id",
          "text": "Setiap hari baru adalah kesempatan untuk menemukan sesuatu yang indah. Mari kita ambil langkah pertama bersama.",
          "src": "./assets/audio/peach-20261110/language-id.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=id · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        }
      ]
    },
    {
      "id": "local-voices",
      "category": "dialects",
      "title": {
        "en": "A sense of place. The same identity.",
        "zh": "乡音不同，音色不变。"
      },
      "description": {
        "en": "Change dialect without changing the reference speaker.",
        "zh": "使用同一个参考说话人，对比不同方言的合成表现。"
      },
      "tags": [
        "DIALECT CONTROL",
        "ZH"
      ],
      "reference": {
        "src": "",
        "transcript": "",
        "label": {
          "en": "Shared voice reference",
          "zh": "共同参考音色"
        }
      },
      "outputs": [
        {
          "label": {
            "en": "Sichuan dialect",
            "zh": "四川话"
          },
          "language": "zh-CN",
          "text": "今天的太阳好安逸哦，走嘛，出去喝碗茶，摆一会儿龙门阵。",
          "src": "./assets/audio/peach-20261110/dialect-sichuan.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=sichuan · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Cantonese",
            "zh": "粤语"
          },
          "language": "zh-HK",
          "text": "今天天氣咁好，不如出去行吓，飲杯茶，慢慢傾。",
          "src": "./assets/audio/peach-20261110/dialect-cantonese.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=yue · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Northeastern Mandarin",
            "zh": "东北话"
          },
          "language": "zh-CN",
          "text": "今儿天气可真不错，咱们出去溜达溜达，找个地方唠唠嗑呗。",
          "src": "./assets/audio/peach-20261110/dialect-dongbei.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=dongbei · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Henan dialect",
            "zh": "河南话"
          },
          "language": "zh-CN",
          "text": "今儿天气怪好哩，咱出去转转，中午再吃碗热乎乎的烩面。",
          "src": "./assets/audio/peach-20261110/dialect-henan.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=henan · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Tianjin dialect",
            "zh": "天津话"
          },
          "language": "zh-CN",
          "text": "您瞧今天这天气多好啊，咱沿着河边走走，再找个地方喝口茶。",
          "src": "./assets/audio/peach-20261110/dialect-tianjin.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=tianjin · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Shaanxi dialect",
            "zh": "陕西话"
          },
          "language": "zh-CN",
          "text": "今天天气真好，咱出去转一圈，回来再吃一碗热乎的面。",
          "src": "./assets/audio/peach-20261110/dialect-shaanxi.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=shaanxi · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Shanghainese",
            "zh": "上海话"
          },
          "language": "wuu",
          "text": "今朝天气蛮好，阿拉一道出去走走，再寻个地方喝杯茶。",
          "src": "./assets/audio/peach-20261110/dialect-shanghai.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=shanghai · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Southern Min",
            "zh": "闽南话"
          },
          "language": "nan",
          "text": "今仔日天气真好，咱做伙出去行行，食茶开讲。",
          "src": "./assets/audio/peach-20261110/dialect-min.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=min · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        }
      ]
    },
    {
      "id": "long-story",
      "category": "longform",
      "title": {
        "en": "A voice that stays with the story.",
        "zh": "让声音，陪故事走得更远。"
      },
      "description": {
        "en": "A listening slot for a complete long-form sample, not an isolated highlight.",
        "zh": "为完整长音频预留展示位，不只截取某一句高光片段。"
      },
      "tags": [
        "LONG CONTEXT",
        "NARRATION"
      ],
      "reference": {
        "src": "",
        "transcript": "",
        "label": {
          "en": "Narrator reference",
          "zh": "旁白参考音色"
        }
      },
      "outputs": [
        {
          "label": {
            "en": "Storytelling · Full sample",
            "zh": "故事旁白 · 完整样例"
          },
          "language": "zh-CN",
          "text": "街角的书店总比别处晚一点熄灯。林夏推开门的时候，雨刚刚停下，空气里混着纸张和泥土的气味。店主从书后抬起头，指了指窗边的座位。\n\n“你找的那本书，今天刚到。”他说。\n\n林夏愣住了。她从来没有告诉过任何人，自己在找一本什么样的书。她走到桌边，翻开封面。第一页只写着一句话：有些故事，要等到你准备好了，才会开始。",
          "src": "./assets/audio/peach-20261110/long-story-output.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Podcast · Room to breathe",
            "zh": "生活播客 · 留一点空白"
          },
          "language": "zh-CN",
          "text": "欢迎收听今天的生活电台。你有没有发现，我们常常把一天安排得满满当当，却忘了给自己留一点空白？早晨醒来，先别急着拿起手机。拉开窗帘，看看今天的天空，给自己倒一杯温水。走在路上的时候，试着留意那些平时没有注意过的小事：树叶的颜色，街角新开的花店，还有迎面走来的人脸上的笑容。\n\n放慢脚步，并不意味着停下前进。它只是让我们重新听见自己的声音，知道什么值得认真，什么可以暂时放下。如果今天只能完成一件小事，那就把它做好。如果有一个人值得感谢，那就把这句话说出口。生活不一定每天都有惊喜，但我们可以每天都带着一点好奇。好了，今天就聊到这里，愿你在忙碌之中，也能找到属于自己的片刻安静。",
          "src": "./assets/audio/peach-20261110/long-podcast.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        }
      ]
    },
    {
      "id": "phonetics",
      "category": "specialty",
      "title": {
        "zh": "SSML 拼读 · 堵塞",
        "en": "SSML spelling · du se"
      },
      "description": {
        "zh": "“堵塞的拼音是 d u du s e se”试听稿：中文引导语与 SSML sym 音素 d / u / du / s / e / se 分两次合成后拼接，拼读效果待听审。",
        "en": "Listening draft for spelling du se: a Chinese introduction and SSML sym phonemes d / u / du / s / e / se are synthesized separately and concatenated. Pronunciation awaits listening review."
      },
      "tags": [
        "SSML",
        "PHONEME"
      ],
      "reference": {
        "src": "",
        "transcript": "",
        "label": {
          "en": "Teaching voice",
          "zh": "教学音色"
        }
      },
      "outputs": [
        {
          "label": {
            "zh": "堵塞 · 拼读试听",
            "en": "Du se · spelling draft"
          },
          "language": "zh-CN",
          "text": "堵塞的拼音是，\n\n<speak><phoneme alphabet=\"sym\" ph=\"d u du s e se\">d u du s e se</phoneme></speak>",
          "src": "./assets/audio/peach-20261110/phonetics-output.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2 API requests: plain-text intro + SSML phonemes, concatenated with 120 ms silence · 2026-11-10",
          "illustrative": false
        }
      ]
    },
    {
      "id": "everyday-scenarios",
      "category": "scenarios",
      "title": {
        "en": "A voice for everyday products",
        "zh": "把声音放进真实场景"
      },
      "description": {
        "en": "Customer service, livestreams and tours: listen to delivery across tasks.",
        "zh": "客服、直播与导览：比较不同任务中的表达方式。"
      },
      "tags": [
        "APPLICATIONS"
      ],
      "reference": {
        "src": "",
        "transcript": "",
        "label": {
          "en": "Voice reference",
          "zh": "参考音色"
        }
      },
      "outputs": [
        {
          "label": {
            "en": "Support · Order enquiry",
            "zh": "客服 · 订单咨询"
          },
          "language": "zh-CN",
          "text": "您好，很高兴为您服务。您的订单已经发出，预计明天下午送达。如果您需要修改收货时间，我可以帮您联系配送人员。",
          "src": "./assets/audio/peach-20261110/scene-service.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=温暖 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Livestream · Product introduction",
            "zh": "直播 · 产品介绍"
          },
          "language": "zh-CN",
          "text": "欢迎刚刚进入直播间的朋友！今天给大家介绍这款随行杯，轻巧好带，杯盖一拧就能打开。上班、出游，都可以把喜欢的饮品带在身边。",
          "src": "./assets/audio/peach-20261110/scene-live.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=高兴 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        },
        {
          "label": {
            "en": "Guide · Museum",
            "zh": "导览 · 博物馆"
          },
          "language": "zh-CN",
          "text": "现在，我们来到展厅的第二部分。请看左手边的这件青铜器，细密的纹饰沿着器身展开。想象一下，千年以前的工匠，如何用双手完成这些精巧的细节。",
          "src": "./assets/audio/peach-20261110/scene-museum.wav",
          "model": "LiveTTS 2.8.1 (requested)",
          "settings": "Selected preset voice · emotion=中立 · lang=zh · speed=1.0 · volume=4.0 · PCM16 / 24 kHz / mono · 2026-11-10",
          "illustrative": false
        }
      ]
    }
  ],
  "evaluations": [
    {
      "id": "general",
      "label": {
        "en": "General speech",
        "zh": "通用场景"
      },
      "title": {
        "en": "JoyAI · General speech evaluation",
        "zh": "JoyAI · 通用场景评测"
      },
      "model": "JoyAI Zeroshot V2.7.1",
      "baseline": "MiniMax Speech 2.8HD",
      "headline": [
        0.74,
        0.64
      ],
      "metric": {
        "en": "Reported weighted score",
        "zh": "原稿报告加权总分"
      },
      "method": {
        "en": "Six dimensions, weighted 25 / 15 / 10 / 20 / 20 / 10%. Listening counts reported separately: 205 wins, 79 ties, 96 losses. Panel size and confidence intervals were not supplied.",
        "zh": "六维权重为 25 / 15 / 10 / 20 / 20 / 10%。另报告听评计数：胜 205、平 79、负 96。原稿未提供评审人数及置信区间。"
      },
      "caveat": {
        "en": "The published aggregate is reproduced as supplied. Recomputing from rounded dimension scores may differ; raw ratings are needed to reconcile it. This does not establish a public leaderboard rank.",
        "zh": "总分按原稿保留，使用已四舍五入的分项分数重算可能不一致，需要原始评分核对。不据此推导公开榜单排名。"
      },
      "rows": [
        {
          "en": "Pronunciation",
          "zh": "发音准确性",
          "values": [
            0.82,
            0.88
          ]
        },
        {
          "en": "Fluency",
          "zh": "流畅性",
          "values": [
            0.67,
            0.66
          ]
        },
        {
          "en": "Clarity",
          "zh": "音质清晰度",
          "values": [
            0.86,
            0.8
          ]
        },
        {
          "en": "Rhythm & prosody",
          "zh": "节奏和韵律",
          "values": [
            0.66,
            0.44
          ]
        },
        {
          "en": "Emotion",
          "zh": "情感表达",
          "values": [
            0.69,
            0.38
          ]
        },
        {
          "en": "Speaker similarity",
          "zh": "原始音色保持",
          "values": [
            0.76,
            0.76
          ]
        }
      ]
    },
    {
      "id": "livestream",
      "label": {
        "en": "Livestream",
        "zh": "数字人直播"
      },
      "title": {
        "en": "Virtual-host livestream evaluation",
        "zh": "数字人直播评测"
      },
      "model": "LiveTTS-ZERO V2.5.2",
      "baseline": "MiniMax Speech 2.6HD",
      "headline": [
        4.17,
        2.96
      ],
      "metric": {
        "en": "Reported aggregate score",
        "zh": "原稿报告综合分"
      },
      "method": {
        "en": "10 livestream clips rated by 17 participants. Scores are transcribed from the team-provided material; the aggregate formula, rating scale, and confidence intervals were not supplied.",
        "zh": "10 个直播片段，17 人参与评分。按团队原稿保留分数，原稿未提供综合分公式、完整量表及置信区间。"
      },
      "caveat": {
        "en": "The displayed aggregate is not the sum of the rounded rows. Without the full scoring protocol, it should not be described as a verified MOS or percentage improvement.",
        "zh": "原稿综合分不等于所列分项简单相加。缺少完整计分规则，不将其表述为经验证的 MOS 或性能提升百分比。"
      },
      "rows": [
        {
          "en": "Pronunciation",
          "zh": "发音准确性",
          "values": [
            0.82,
            0.62
          ]
        },
        {
          "en": "Fluency",
          "zh": "流畅性",
          "values": [
            0.87,
            0.74
          ]
        },
        {
          "en": "Clarity",
          "zh": "音质清晰度",
          "values": [
            0.66,
            0.59
          ]
        },
        {
          "en": "Naturalness",
          "zh": "自然度",
          "values": [
            0.66,
            0.29
          ]
        },
        {
          "en": "Emotion",
          "zh": "情感表达力",
          "values": [
            0.58,
            0.28
          ]
        },
        {
          "en": "Voice consistency",
          "zh": "音色一致性",
          "values": [
            0.59,
            0.5
          ]
        }
      ]
    },
    {
      "id": "narration",
      "label": {
        "en": "Long-form content",
        "zh": "内容创作"
      },
      "title": {
        "en": "Long-form content evaluation",
        "zh": "文明之影 · 长文本内容创作评测"
      },
      "model": "LiveTTS V2.7.3",
      "baseline": "MiniMax Speech 2.8HD",
      "headline": [
        4.791,
        4.298
      ],
      "metric": {
        "en": "Reported MOS",
        "zh": "原稿报告 MOS"
      },
      "method": {
        "en": "The source reports long-form ratings, an average score of 0.8953 vs 0.6490, and MOS of 4.791 vs 4.298. The number of clips, raters, and confidence intervals were not provided.",
        "zh": "原稿报告长文本评分、综合平均分 0.8953 对 0.6490，以及 MOS 4.791 对 4.298。未提供音频条数、评审人数及置信区间。"
      },
      "caveat": {
        "en": "MOS and the six dimension scores use different reported scales. They are shown separately, and are not interchangeable with other studies or model versions.",
        "zh": "MOS 与六维分数使用不同报告量表，分别展示，不与其他实验或模型版本直接混比。"
      },
      "rows": [
        {
          "en": "Pronunciation",
          "zh": "发音准确性",
          "values": [
            0.8969,
            0.7062
          ]
        },
        {
          "en": "Fluency",
          "zh": "流畅性",
          "values": [
            0.9719,
            0.9344
          ]
        },
        {
          "en": "Clarity",
          "zh": "音质清晰度",
          "values": [
            0.8438,
            0.45
          ]
        },
        {
          "en": "Naturalness",
          "zh": "自然度",
          "values": [
            0.9094,
            0.8188
          ]
        },
        {
          "en": "Emotion",
          "zh": "情感表达",
          "values": [
            0.8527,
            0.8094
          ]
        },
        {
          "en": "Voice consistency",
          "zh": "音色一致性",
          "values": [
            0.8969,
            0.175
          ]
        }
      ]
    }
  ]
};
