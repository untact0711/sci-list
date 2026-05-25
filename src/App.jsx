import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Upload, Trash2, Copy, CheckCircle2, Image as ImageIcon, Loader2, AlertCircle, ClipboardPaste, FileText, HelpCircle, Key } from 'lucide-react';

const STANDARD_EQUIPMENT = [
  { category: "공통-측정교구", name: "전자저울", spec: "칭량 100~500 g, 감량 0.1 g", requirement: "4학생당 1", type: "필수", keywords: ["전자저울", "저울"] },
  { category: "공통-측정교구", name: "디지털 온도계", spec: "접촉식, 온도범위 약 -40~200 ℃", requirement: "4학생당 1", type: "필수", keywords: ["디지털 온도계", "디지털온도계"] },
  { category: "공통-측정교구", name: "센서(온도)", spec: "온도 범위 약 -40~125 ℃, 유선 또는 무선", requirement: "4학생당 1", type: "필수", keywords: ["온도 센서", "무선 온도 센서", "MBL 온도 센서", "온도센서", "온도 측정기"] },
  { category: "공통-측정교구", name: "온도계", spec: "알코올, -10~100 ℃ 이상", requirement: "4학생당 1", type: "필수", keywords: ["온도계", "알코올 온도계", "유리 온도계"] },
  { category: "공통-측정교구", name: "초시계", spec: "디지털식", requirement: "4학생당 1", type: "권장", keywords: ["초시계", "스톱워치"] },
  { category: "공통-측정교구", name: "줄자", spec: "2m 이상", requirement: "4학생당 1", type: "필수", keywords: ["줄자", "자", "플라스틱 자", "막대자", "30cm 자"] },
  { category: "공통-일반교구", name: "비커", spec: "각종(50~1,000mL)", requirement: "4학생당 1", type: "필수", keywords: ["비커", "유리 비커", "유리비커", "플라스틱 비커"] },
  { category: "공통-일반교구", name: "시험관", spec: "각종 10개 1조", requirement: "4학생당 1", type: "필수", keywords: ["시험관", "유리 시험관"] },
  { category: "공통-일반교구", name: "가지 달린 시험관", spec: "각종 10개 1조", requirement: "4학생당 1", type: "필수", keywords: ["가지 달린 시험관", "가지달린시험관"] },
  { category: "공통-일반교구", name: "플라스크", spec: "각종(삼각, 둥근바닥 등)", requirement: "4학생당 1", type: "필수", keywords: ["플라스크", "둥근바닥 플라스크", "삼각 플라스크", "둥근 바닥 플라스크", "삼각플라스크"] },
  { category: "공통-일반교구", name: "전열기(또는 핫플레이트)", spec: "AC, 500~1,000 W", requirement: "4학생당 1", type: "필수", keywords: ["전열기", "핫플레이트", "가열 장치", "가열장치"] },
  { category: "공통-일반교구", name: "철제스탠드", spec: "클램프, 링 등 부속품 포함", requirement: "4학생당 1조", type: "필수", keywords: ["철제스탠드", "스탠드", "철제 스탠드", "스텐드", "가열용 스탠드"] },
  { category: "공통-일반교구", name: "끓음쪽", spec: "도자기 조각 등", requirement: "4학생당 1", type: "필수", keywords: ["끓음쪽", "비등석"] },
  { category: "공통-일반교구", name: "고무 마개", spec: "각종(구멍 뚫린 것 포함)", requirement: "4학생당 1조", type: "필수", keywords: ["고무 마개", "고무마개", "실리콘 마개", "실리콘마개"] },
  { category: "공통-일반교구", name: "페트리접시", spec: "유리 또는 플라스틱", requirement: "4학생당 1", type: "필수", keywords: ["페트리접시", "페트리 접시"] },
  { category: "공통-일반교구", name: "스마트 기기", spec: "태블릿 PC 등", requirement: "4학생당 1", type: "필수", keywords: ["스마트 기기", "스마트기기", "태블릿", "스마트폰", "노트북", "PC"] },
  { category: "공통-일반교구", name: "깔때기", spec: "약 Ø60 mm, 유리(플라스틱)", requirement: "4학생당 1", type: "필수", keywords: ["깔때기"] },
  { category: "공통-일반교구", name: "유리막대", spec: "Ø5 mm, 길이 약 300 mm", requirement: "4학생당 1", type: "필수", keywords: ["유리막대", "유리 막대"] },
  { category: "공통-일반교구", name: "약숟가락", spec: "스테인리스 강제", requirement: "4학생당 1", type: "권장", keywords: ["약숟가락", "시약스푼", "약 숟가락"] },
  { category: "공통-일반교구", name: "약포지(시약포지)", spec: "각종", requirement: "4학생당 1", type: "권장", keywords: ["약포지", "시약포지", "유산지"] },
  { category: "공통-일반교구", name: "시험관 집게", spec: "철제 또는 목제", requirement: "2학생당 1", type: "필수", keywords: ["시험관 집게", "시험관집게", "집게"] },
  { category: "공통-일반교구", name: "교반기", spec: "자석식 교반기(가열 겸용 포함)", requirement: "4학생당 1", type: "권장", keywords: ["교반기", "자석 젓개", "자석교반기", "자석젓개"] },
  { category: "공통-일반교구", name: "시험관대", spec: "목제 또는 플라스틱제", requirement: "4학생당 1", type: "필수", keywords: ["시험관대", "가열용 시험관대", "시험관 대"] },
  { category: "공통-일반교구", name: "스포이트", spec: "각종", requirement: "4학생당 1", type: "필수", keywords: ["스포이트", "스포이드", "피펫"] },
  { category: "공통-일반교구", name: "수조", spec: "각종(유리, 플라스틱)", requirement: "4학생당 1", type: "필수", keywords: ["수조", "물통"] },
  { category: "공통-일반교구", name: "유리병", spec: "뚜껑 포함", requirement: "4학생당 1", type: "필수", keywords: ["유리병", "뚜껑 있는 유리병", "뚜껑있는유리병", "집기병"] },
  { category: "공통-일반교구", name: "눈금실린더", spec: "유리 또는 플라스틱", requirement: "4학생당 1", type: "필수", keywords: ["눈금실린더", "메스실린더"] },
  { category: "공통-일반교구", name: "핀셋", spec: "스테인리스", requirement: "4학생당 1", type: "필수", keywords: ["핀셋", "핀셑"] },
  { category: "공통-일반교구", name: "돋보기", spec: "각종", requirement: "4학생당 1", type: "권장", keywords: ["돋보기", "확대경", "루페"] },
  { category: "안전장구", name: "학생용 실험복", spec: "면소재 실험복", requirement: "1학생당 1", type: "필수", keywords: ["실험복", "학생용 실험복", "가운"] },
  { category: "안전장구", name: "내열 장갑", spec: "내열온도 200 ℃", requirement: "학교당 6", type: "필수", keywords: ["내열 장갑", "내열장갑", "화상 방지 장갑"] },
  { category: "안전장구", name: "(안전)장갑", spec: "1회용 (폴리에틸렌, 라텍스, 나이트릴)", requirement: "1학생당 1", type: "필수", keywords: ["장갑", "안전장갑", "실험용 장갑", "라텍스 장갑", "니트릴 장갑", "면장갑", "실험용장갑", "고무장갑"] },
  { category: "안전장구", name: "보안경", spec: "안경식", requirement: "1학생당 1", type: "필수", keywords: ["보안경", "안전경", "고글"] }
];

const EXCLUDED_KEYWORDS = [
  '거름종이', '거름 종이', '시약포지', '약포지', '시약 포지', '약 포지', 
  '유산지', '리트머스', 'pH시험지', '시약', '용액', '물', '얼음', 
  '에탄올', '메탄올', '가루', '소금', '설탕', '모래', '색소'
];

export default function App() {
  const [textbooks, setTextbooks] = useState([]);
  const [copyState, setCopyState] = useState('idle');
  const [copiedCardId, setCopiedCardId] = useState(null);
  const fileInputRef = useRef(null);
  
  const [apiKey, setApiKey] = useState("");
  const [inputKey, setInputKey] = useState(""); 
  const [isKeyEditing, setIsKeyEditing] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedKey = localStorage.getItem('geminiApiKey');
      if (storedKey) {
        setApiKey(storedKey);
        setInputKey(storedKey);
        setIsKeyEditing(false);
      }
    }
  }, []);

  const saveApiKey = () => {
    if (!inputKey.trim()) {
      alert("API 키를 입력해주세요!");
      return;
    }
    setApiKey(inputKey);
    if (typeof window !== 'undefined') {
      localStorage.setItem('geminiApiKey', inputKey);
    }
    setIsKeyEditing(false);
  };

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]); 
      reader.onerror = error => reject(error);
    });
  };

  const extractEquipmentFromImage = async (base64Data, mimeType) => {
    if (!apiKey) {
      throw new Error("API 키가 설정되지 않았습니다. 상단의 'API 키 변경하기'를 눌러 키를 입력해주세요.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
    
    const promptText = `
    당신은 텍스트 판독 및 과학교구 추출 전문가입니다.
    업로드된 이미지는 교과서 실험의 '준비물' 텍스트 부분만 아주 얇게 잘라낸 캡처 조각이거나 전체 페이지입니다.

    [핵심 임무]
    1. 2022 개정 과학교구 설비 기준표에 해당하는 정식 교구(비커, 온도계, 스마트 기기 등)와 일반 도구(가위, 자, 테이프 등)만 추출하세요.
    2. [강력 제외] 물, 에탄올, 시약 등의 '액체/화학 물질'과 거름종이, 시약포지, 약포지 등 1회성 '소모품류'는 목록에서 절대 추출하지 마세요.

    결과는 반드시 제공된 JSON 스키마에 따라 'equipment' 배열로 응답하세요.
    `;

    const payload = {
      contents: [{
        role: "user",
        parts: [
          { text: promptText },
          { inlineData: { mimeType: mimeType, data: base64Data } }
        ]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: "OBJECT",
          properties: {
            equipment: {
              type: "ARRAY",
              items: { type: "STRING" }
            }
          },
          required: ["equipment"]
        }
      }
    };

    const maxRetries = 3;
    const delays = [1000, 2000, 4000];

    for (let i = 0; i < maxRetries; i++) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        
        if (!response.ok) {
          throw new Error(`API 통신 에러 (${response.status}) - API 키가 유효한지 확인해주세요.`);
        }
        
        const result = await response.json();
        const text = result.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (text) {
          try {
            const parsed = JSON.parse(text);
            const rawEquipment = parsed.equipment || [];
            
            const filteredEquipment = rawEquipment.filter(item => {
              const normalizedItem = item.replace(/\s+/g, '');
              return !EXCLUDED_KEYWORDS.some(kw => normalizedItem.includes(kw.replace(/\s+/g, '')));
            });
            
            return filteredEquipment;
          } catch (e) {
            return [];
          }
        }
        return [];
      } catch (error) {
        if (i === maxRetries - 1) throw error;
        await new Promise(r => setTimeout(r, delays[i]));
      }
    }
  };

  const mapToStandardDb = (extractedItems) => {
    const mapped = extractedItems.map(item => {
      const normalizedItem = item.replace(/\s+/g, '');
      let found = null;

      found = STANDARD_EQUIPMENT.find(std => 
        std.keywords.some(kw => normalizedItem === kw.replace(/\s+/g, ''))
      );

      if (!found) {
        found = STANDARD_EQUIPMENT.find(std => 
          std.keywords.some(kw => {
            const normalizedKw = kw.replace(/\s+/g, '');
            if (normalizedKw === '장갑' && normalizedItem.includes('내열')) return false;
            if (normalizedKw === '장갑' && normalizedItem.includes('고무')) return false; 
            return normalizedItem.includes(normalizedKw);
          })
        );
      }
      
      return { original: item, standard: found || null };
    });

    const uniqueMapped = [];
    const seen = new Set();
    
    mapped.forEach(item => {
      const key = item.standard ? `std_${item.standard.name}` : `org_${item.original.replace(/\s+/g, '')}`;
      if (!seen.has(key)) {
        seen.add(key);
        uniqueMapped.push(item);
      }
    });

    uniqueMapped.sort((a, b) => {
      if (a.standard && !b.standard) return -1;
      if (!a.standard && b.standard) return 1;
      return 0;
    });

    return uniqueMapped;
  };

  const processFiles = useCallback(async (files) => {
    if (!files || files.length === 0) return;
    
    if (!apiKey) {
       alert("먼저 API 키를 설정해주세요!");
       setIsKeyEditing(true);
       return;
    }

    for (const file of files) {
      const tbId = Date.now() + Math.random();
      const ext = file.name ? file.name.split('.').pop().toLowerCase() : '';
      const isHwp = ext === 'hwp' || ext === 'hwpx';
      
      setTextbooks(prev => {
        const title = `교과서 ${prev.length + 1}`;
        return [...prev, {
          id: tbId,
          title: title,
          fileName: file.name || 'Pasted Content',
          imageUrl: URL.createObjectURL(file),
          isLoading: !isHwp,
          isHwp: isHwp,
          isPdf: ext === 'pdf' || file.type === 'application/pdf',
          items: [],
          error: null
        }];
      });

      if (isHwp) {
        setTextbooks(prev => prev.map(tb => 
          tb.id === tbId 
            ? { ...tb, isLoading: false, error: "HWP 파일은 화면을 캡처하여 Ctrl+V로 붙여넣어 주세요." }
            : tb
        ));
        continue;
      }

      try {
        const base64 = await getBase64(file);
        
        let targetMimeType = file.type;
        if (ext === 'pdf') targetMimeType = 'application/pdf';
        if (!targetMimeType || (!targetMimeType.startsWith('image/') && targetMimeType !== 'application/pdf')) {
          targetMimeType = 'image/png';
        }

        const extracted = await extractEquipmentFromImage(base64, targetMimeType);
        const mappedItems = mapToStandardDb(extracted);
        
        setTextbooks(prev => prev.map(tb => 
          tb.id === tbId 
            ? { ...tb, isLoading: false, items: mappedItems }
            : tb
        ));
      } catch (error) {
        setTextbooks(prev => prev.map(tb => 
          tb.id === tbId 
            ? { ...tb, isLoading: false, error: error.message || "서버와 통신 중 문제가 발생했습니다." }
            : tb
        ));
      }
    }
  }, [apiKey]);

  const handleFileUpload = (e) => {
    processFiles(Array.from(e.target.files));
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  useEffect(() => {
    const handlePaste = (e) => {
      // API 키 설정 모드일 때는 붙여넣기 무시
      if (isKeyEditing) return;
      
      const items = e.clipboardData?.items;
      if (!items) return;

      const filesToProcess = [];
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1 || items[i].type.indexOf('pdf') !== -1) {
          const file = items[i].getAsFile();
          if (file) filesToProcess.push(file);
        }
      }

      if (filesToProcess.length > 0) {
        processFiles(filesToProcess);
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [processFiles, isKeyEditing]);

  const removeTextbook = (id) => {
    setTextbooks(prev => prev.filter(tb => tb.id !== id).map((tb, idx) => ({
      ...tb,
      title: `교과서 ${idx + 1}`
    })));
  };

  const generateAnalysisTable = () => {
    const aggregated = {};
    
    textbooks.forEach(tb => {
      if (tb.isLoading || tb.error) return;
      tb.items.forEach(item => {
        const key = item.standard ? item.standard.name : item.original;
        
        if (!aggregated[key]) {
          aggregated[key] = {
            category: item.standard ? item.standard.category : "기타 (기준표 외)",
            name: item.standard ? item.standard.name : item.original,
            spec: item.standard ? item.standard.spec : "-",
            requirement: item.standard ? item.standard.requirement : "-",
            type: item.standard ? item.standard.type : "-",
            textbooks: new Set()
          };
        }
        aggregated[key].textbooks.add(tb.title);
      });
    });

    const resultTable = Object.values(aggregated).map(item => {
       const isCommon = item.textbooks.size === textbooks.filter(t => !t.error).length && item.textbooks.size > 1;
       const remarks = isCommon ? "공통" : Array.from(item.textbooks).join(", ");
       return { ...item, remarks };
    });

    const order = { "공통-측정교구": 1, "공통-일반교구": 2, "안전장구": 3, "기타 (기준표 외)": 4 };
    resultTable.sort((a, b) => (order[a.category] || 5) - (order[b.category] || 5));

    return resultTable;
  };

  const analysisData = generateAnalysisTable();

  const copyToHWP = (withHeader = true) => {
    if (analysisData.length === 0) return;

    const escapeHtml = (v) => String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    const escapeTsv = (v) => String(v ?? '').replace(/\t/g, ' ').replace(/\n/g, ' ').replace(/\r/g, '');
    const HEADERS = ["영역", "교구 종목", "규격", "소요 기준", "분류", "비고"];

    const tsvLines = [];
    if (withHeader) tsvLines.push(HEADERS.map(escapeTsv).join('\t'));
    analysisData.forEach(row => {
      tsvLines.push([row.category, row.name, row.spec, row.requirement, row.type, row.remarks].map(escapeTsv).join('\t'));
    });
    const tsv = tsvLines.join('\r\n');

    let html = `<table border="1" style="border-collapse: collapse;">`;
    if (withHeader) {
      html += `<tr>${HEADERS.map(h => `<th>${escapeHtml(h)}</th>`).join('')}</tr>`;
    }
    analysisData.forEach(row => {
      html += `<tr>${[row.category, row.name, row.spec, row.requirement, row.type, row.remarks].map(v => `<td>${escapeHtml(v)}</td>`).join('')}</tr>`;
    });
    html += `</table>`;

    const container = document.createElement("div");
    container.innerHTML = html;
    container.style.position = "fixed";
    container.style.left = "-9999px";
    document.body.appendChild(container);

    const handleCopy = (e) => {
      e.clipboardData.setData('text/html', html);
      e.clipboardData.setData('text/plain', tsv);
      e.preventDefault();
    };
    container.addEventListener('copy', handleCopy);

    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(container);
    selection.removeAllRanges();
    selection.addRange(range);

    try {
      document.execCommand('copy');
      setCopyState(withHeader ? 'copiedWithHeader' : 'copiedDataOnly');
      setTimeout(() => setCopyState('idle'), 3000);
    } catch (err) {
      alert('클립보드 복사에 실패했습니다.');
    } finally {
      container.removeEventListener('copy', handleCopy);
      selection.removeAllRanges();
      document.body.removeChild(container);
    }
  };

  const handleCopyCardList = (tb) => {
    if (!tb.items || tb.items.length === 0) return;
    
    const listText = tb.items.map(item => item.standard ? item.standard.name : item.original).join(', ');
    
    const textArea = document.createElement("textarea");
    textArea.value = listText;
    document.body.appendChild(textArea);
    textArea.select();
    
    try {
      document.execCommand('copy');
      setCopiedCardId(tb.id);
      setTimeout(() => setCopiedCardId(null), 2000);
    } catch (err) {
      console.error(err);
    } finally {
      document.body.removeChild(textArea);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans p-6">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* 상단 헤더 & 파일 업로드 버튼 */}
        <header className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              🔬 스마트 과학교구 분석기
            </h1>
            <p className="mt-2 text-slate-500">
              이미지 캡처 후 <strong>Ctrl+V</strong>를 누르면 2022 개정 기준에 맞게 추출됩니다.
            </p>
          </div>
          <div>
            <input 
              type="file" 
              multiple 
              accept="image/*, application/pdf, .pdf, .hwp, .hwpx" 
              className="hidden" 
              ref={fileInputRef}
              onChange={handleFileUpload}
            />
            <button 
              onClick={() => fileInputRef.current.click()}
              className="flex items-center gap-2 bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-medium transition-colors shadow-sm whitespace-nowrap"
            >
              <Upload size={20} />
              파일 직접 선택
            </button>
          </div>
        </header>

        {/* API 키 설정 섹션 */}
        {isKeyEditing ? (
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-200">
            <h2 className="text-xl font-bold text-blue-900 flex items-center gap-2 mb-4">
              <Key className="text-blue-500" /> 시작 전: Gemini API 키 입력
            </h2>
            <p className="text-sm text-slate-600 mb-6">
              AI 분석을 위해 구글 AI Studio에서 무료로 발급받은 API 키를 입력해주세요. (브라우저에만 안전하게 저장됩니다)
            </p>
            <div className="flex gap-3">
              <input 
                type="password" 
                placeholder="AIzaSy..." 
                value={inputKey}
                onChange={(e) => setInputKey(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button 
                onClick={saveApiKey}
                className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700"
              >
                저장 및 시작
              </button>
            </div>
          </div>
        ) : (
          <div className="text-right -mt-4">
             <button 
               onClick={() => setIsKeyEditing(true)} 
               className="text-xs text-slate-400 hover:text-blue-600 underline"
             >
               API 키 변경하기
             </button>
          </div>
        )}

        {/* 캡처 유도 메인 화면 (키가 세팅되었고 업로드된 파일이 없을 때) */}
        {!isKeyEditing && textbooks.length === 0 && (
          <div className="text-center py-24 px-6 border-2 border-dashed border-slate-300 rounded-3xl bg-slate-50/80 transition-all hover:bg-slate-100/50 cursor-pointer" onClick={() => fileInputRef.current.click()}>
            <div className="bg-white w-24 h-24 rounded-full flex flex-col items-center justify-center mx-auto mb-6 shadow-sm border border-slate-100">
              <ClipboardPaste className="text-blue-600 mb-1" size={32} />
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-3">화면 캡처 후 Ctrl + V</h3>
            <p className="text-slate-500 max-w-lg mx-auto text-base leading-relaxed">
              교과서 실험 준비물 텍스트를 캡처하여 화면 아무 곳에서나 <strong>Ctrl+V</strong>를 눌러보세요.<br/>
              소모품은 자동으로 걸러지고 정식 교구만 완벽하게 분석됩니다.
            </p>
          </div>
        )}

        {/* 업로드된 교과서 분석 카드 */}
        {textbooks.length > 0 && (
          <section>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {textbooks.map(tb => (
                <div key={tb.id} className="bg-white p-5 rounded-2xl shadow-sm border border-slate-200 flex flex-col h-full relative">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg text-slate-800">{tb.title}</h3>
                    <button onClick={() => removeTextbook(tb.id)} className="text-slate-400 hover:text-red-500 transition-colors p-1" title="삭제">
                      <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="w-full h-32 bg-slate-100 rounded-lg overflow-hidden mb-4 relative flex items-center justify-center border border-slate-200 border-dashed">
                    {tb.isPdf ? (
                      <div className="flex flex-col items-center justify-center text-rose-500 opacity-80">
                        <FileText size={36} className="mb-2" />
                        <span className="font-bold">PDF 문서</span>
                      </div>
                    ) : (
                      <img src={tb.imageUrl} alt={tb.title} className="w-full h-full object-contain bg-white opacity-90 p-2" />
                    )}

                    {tb.isLoading && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center z-10">
                        <Loader2 className="animate-spin text-blue-600 mb-2" size={28} />
                        <span className="text-sm font-bold text-blue-800">AI 판독 중...</span>
                      </div>
                    )}
                  </div>

                  <div 
                    onClick={() => !tb.isLoading && !tb.error && handleCopyCardList(tb)}
                    className={`flex-1 relative rounded-xl border transition-all ${
                      tb.isLoading || tb.error 
                        ? 'border-transparent' 
                        : 'border-slate-100 hover:border-blue-300 hover:bg-blue-50/50 hover:shadow-sm cursor-pointer group p-3 -mx-3'
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2 border-b border-slate-100 pb-1.5">
                      <h4 className="text-sm font-bold text-slate-600 group-hover:text-blue-700 transition-colors">AI 추출 결과</h4>
                    </div>

                    {tb.isLoading ? (
                      <div className="space-y-2 mt-2">
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4"></div>
                        <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2"></div>
                      </div>
                    ) : tb.error ? (
                      <div className="flex items-start gap-2 text-rose-600 text-sm bg-rose-50 p-2.5 rounded-lg border border-rose-100 leading-tight font-medium mt-2">
                        <AlertCircle size={16} className="shrink-0 mt-0.5" /> 
                        <span>{tb.error}</span>
                      </div>
                    ) : (
                      <ul className="text-sm space-y-2 overflow-y-auto max-h-44 pr-2">
                        {tb.items.map((item, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            {item.standard ? (
                              <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                            ) : (
                              <HelpCircle size={16} className="text-slate-400 shrink-0" />
                            )}
                            <span className="text-slate-700 font-medium">{item.original}</span>
                            {item.standard ? (
                              item.standard.name !== item.original && (
                                <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md ml-auto flex-shrink-0 font-bold border border-blue-100">
                                  → {item.standard.name}
                                </span>
                              )
                            ) : (
                              <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md ml-auto flex-shrink-0 border border-slate-200">기타 도구</span>
                            )}
                          </li>
                        ))}
                        {tb.items.length === 0 && <li className="text-slate-500 text-center py-4">추출된 교구가 없습니다.</li>}
                      </ul>
                    )}
                    
                    {copiedCardId === tb.id && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center rounded-xl z-20">
                        <span className="bg-emerald-500 text-white px-3 py-1.5 rounded-lg text-sm font-bold flex items-center gap-2 shadow-sm">
                          <CheckCircle2 size={16} /> 복사됨!
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 통합 분석 결과 표 */}
        {textbooks.length > 0 && textbooks.filter(t => !t.error).every(tb => !tb.isLoading) && analysisData.length > 0 && (
          <section className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-slate-800">📊 2022 개정 기준 통합 교구 분석표</h2>
              </div>
              <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-xl">
                <button 
                  onClick={() => copyToHWP(true)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-bold text-sm ${copyState === 'copiedWithHeader' ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700 shadow-sm'}`}
                >
                  {copyState === 'copiedWithHeader' ? <CheckCircle2 size={16} /> : <Copy size={16} />}
                  표 전체 복사
                </button>
              </div>
            </div>

            {copyState !== 'idle' && (
              <div className="bg-emerald-50 px-6 py-4 border-b border-emerald-100 flex items-start gap-3">
                <CheckCircle2 className="text-emerald-500 mt-0.5 shrink-0" size={20} />
                <div className="text-sm text-emerald-800 leading-relaxed">
                  <strong>클립보드에 표 데이터가 완벽하게 복사되었습니다!</strong><br/>
                  한글 문서에서 표를 생성할 위치에 <code>Ctrl+V</code>를 누르시면 각 항목이 칸에 나뉘어 들어갑니다.
                </div>
              </div>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-semibold w-36">영역</th>
                    <th scope="col" className="px-6 py-4 font-semibold w-48">교구 종목</th>
                    <th scope="col" className="px-6 py-4 font-semibold">규격</th>
                    <th scope="col" className="px-6 py-4 font-semibold w-28 whitespace-nowrap">소요 기준</th>
                    <th scope="col" className="px-6 py-4 font-semibold w-28 text-center">분류</th>
                    <th scope="col" className="px-6 py-4 font-semibold w-48">비고</th>
                  </tr>
                </thead>
                <tbody>
                  {analysisData.map((row, idx) => {
                    const isOther = row.category === "기타 (기준표 외)";
                    return (
                      <tr key={idx} className={`border-b border-slate-50 ${isOther ? 'bg-slate-50/30' : 'bg-white'}`}>
                        <td className="px-6 py-4 font-medium text-slate-700">{row.category.replace('공통-', '')}</td>
                        <td className="px-6 py-4 font-bold text-slate-800">{row.name}</td>
                        <td className="px-6 py-4 text-slate-500">{row.spec}</td>
                        <td className="px-6 py-4 text-slate-500">{row.requirement}</td>
                        <td className="px-6 py-4 text-center">
                          {isOther ? <span className="text-slate-400">-</span> : (
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${row.type === '필수' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'}`}>{row.type}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-slate-500">{row.remarks}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}