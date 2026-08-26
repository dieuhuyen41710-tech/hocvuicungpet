import React, { useState } from 'react';
import { Calculator, Triangle, Circle, Square, Cylinder } from 'lucide-react';

export default function DigitalTools() {
  const [activeTab, setActiveTab] = useState<'CALC' | 'GEOMETRY'>('CALC');

  return (
    <div className="max-w-6xl mx-auto space-y-6 h-full flex flex-col">
      <div className="bg-white p-6 rounded-[32px] shadow-xl border-4 border-[#DBEAFE] flex flex-col sm:flex-row justify-between items-center gap-4">
         <h1 className="text-3xl font-black text-[#1E3A8A] flex items-center gap-3">
            <div className="w-12 h-12 bg-[#FEF3C7] rounded-full flex items-center justify-center border-4 border-[#FCD34D]">
              <Calculator className="text-[#D97706]" size={24} />
            </div>
            Công Cụ Số
         </h1>
         <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setActiveTab('CALC')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'CALC' ? 'bg-white text-[#2563EB] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Máy Tính Bỏ Túi
            </button>
            <button
              onClick={() => setActiveTab('GEOMETRY')}
              className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'GEOMETRY' ? 'bg-white text-[#059669] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Hình Học Trực Quan
            </button>
         </div>
      </div>

      <div className="flex-1 bg-white rounded-[32px] shadow-xl border-4 border-[#E2E8F0] overflow-hidden flex">
        {activeTab === 'CALC' ? <BasicCalculator /> : <GeometryCalculator />}
      </div>
    </div>
  );
}

function BasicCalculator() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');

  const handlePress = (val: string) => {
    if (val === 'C') {
      setDisplay('0');
      setEquation('');
      return;
    }
    if (val === 'DEL') {
      setDisplay(prev => prev.length > 1 ? prev.slice(0, -1) : '0');
      return;
    }
    if (val === '=') {
      try {
        const safeEval = new Function('return ' + display.replace(/×/g, '*').replace(/÷/g, '/').replace(/π/g, 'Math.PI').replace(/√\(/g, 'Math.sqrt(').replace(/\^/g, '**'));
        const res = safeEval();
        setEquation(display + ' =');
        // Round to 8 decimals to avoid floating point issues
        setDisplay(String(Math.round(res * 100000000) / 100000000));
      } catch (e) {
        setDisplay('Lỗi');
      }
      return;
    }
    
    setDisplay(prev => {
      if (prev === '0' && val !== '.') return val;
      if (prev === 'Lỗi') return val;
      return prev + val;
    });
  };

  const buttons = [
    ['C', 'DEL', '(', ')'],
    ['√(', 'π', '^', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['0', '.', '=']
  ];

  return (
    <div className="w-full h-full flex flex-col items-center justify-start sm:justify-center p-4 sm:p-8 bg-gray-50 overflow-y-auto">
      <div className="w-full max-w-sm bg-white rounded-[32px] p-5 shadow-2xl border-4 border-gray-200 flex flex-col gap-3 my-auto shrink-0">
        <div className="bg-[#0F172A] p-5 rounded-2xl flex flex-col items-end gap-2 shadow-inner min-h-[100px] justify-end overflow-hidden">
          <div className="text-gray-400 font-bold text-sm tracking-widest">{equation}</div>
          <div className="text-4xl font-black text-white truncate w-full text-right font-mono tracking-wider">{display}</div>
        </div>
        
        <div className="grid gap-3">
          {buttons.map((row, i) => (
            <div key={i} className={`grid gap-3 grid-cols-4`}>
              {row.map(btn => (
                <button
                  key={btn}
                  onClick={() => handlePress(btn)}
                  className={`
                    h-12 sm:h-14 rounded-2xl font-black text-xl transition-all shadow-sm
                    ${['÷', '×', '-', '+', '='].includes(btn) ? 'bg-[#3B82F6] text-white hover:bg-[#2563EB] shadow-[0_4px_0_#1D4ED8]' : 
                      ['C', 'DEL'].includes(btn) ? 'bg-[#EF4444] text-white hover:bg-[#DC2626] shadow-[0_4px_0_#B91C1C]' : 
                      ['(', ')', '√(', 'π', '^'].includes(btn) ? 'bg-gray-200 text-gray-700 hover:bg-gray-300 shadow-[0_4px_0_#9CA3AF]' :
                      'bg-white border-2 border-gray-100 text-gray-800 hover:bg-gray-50 shadow-[0_4px_0_#E5E7EB]'}
                    active:translate-y-1 active:shadow-none ${btn === '0' ? 'col-span-2' : 'col-span-1'}
                  `}
                  
                >
                  {btn}
                </button>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const SHAPES = [
  { id: 'rect_prism', name: 'Hình hộp chữ nhật', category: '3D' },
  { id: 'cube', name: 'Hình lập phương', category: '3D' },
  { id: 'tri_prism', name: 'Hình lăng trụ đứng tam giác', category: '3D' },
  { id: 'quad_prism', name: 'Hình lăng trụ đứng tứ giác', category: '3D' },
  { id: 'tri_pyr', name: 'Hình chóp tam giác đều', category: '3D' },
  { id: 'quad_pyr', name: 'Hình chóp tứ giác đều', category: '3D' },
  { id: 'cylinder', name: 'Hình trụ', category: '3D' },
  { id: 'cone', name: 'Hình nón', category: '3D' },
  { id: 'sphere', name: 'Hình cầu', category: '3D' },
  { id: 'triangle', name: 'Hình tam giác', category: '2D' },
  { id: 'square', name: 'Hình vuông', category: '2D' },
  { id: 'rectangle', name: 'Hình chữ nhật', category: '2D' },
  { id: 'parallelogram', name: 'Hình bình hành', category: '2D' },
  { id: 'rhombus', name: 'Hình thoi', category: '2D' },
  { id: 'trapezoid', name: 'Hình thang', category: '2D' },
];

function GeometryCalculator() {
  const [shape, setShape] = useState(SHAPES[0].id);
  const [inputs, setInputs] = useState<Record<string, string>>({});
  const [keepPi, setKeepPi] = useState(false);

  const selectedShape = SHAPES.find(s => s.id === shape);

  const handleInputChange = (key: string, value: string) => {
    setInputs(prev => ({ ...prev, [key]: value }));
  };

  const getFields = () => {
    switch (shape) {
      case 'rect_prism': return [{id: 'a', label: 'Chiều dài (a)'}, {id: 'b', label: 'Chiều rộng (b)'}, {id: 'h', label: 'Chiều cao (h)'}];
      case 'cube': return [{id: 'a', label: 'Cạnh (a)'}];
      case 'tri_prism': return [{id: 'a', label: 'Cạnh đáy 1 (a)'}, {id: 'b', label: 'Cạnh đáy 2 (b)'}, {id: 'c', label: 'Cạnh đáy 3 (c)'}, {id: 'h', label: 'Chiều cao lăng trụ (h)'}];
      case 'quad_prism': return [{id: 'a', label: 'Cạnh đáy 1'}, {id: 'b', label: 'Cạnh đáy 2'}, {id: 'c', label: 'Cạnh đáy 3'}, {id: 'd', label: 'Cạnh đáy 4'}, {id: 'h', label: 'Chiều cao lăng trụ (h)'}];
      case 'tri_pyr': return [{id: 'a', label: 'Cạnh đáy (a)'}, {id: 'h', label: 'Chiều cao chóp (h)'}, {id: 'd', label: 'Trung đoạn (d)'}];
      case 'quad_pyr': return [{id: 'a', label: 'Cạnh đáy vuông (a)'}, {id: 'h', label: 'Chiều cao chóp (h)'}, {id: 'd', label: 'Trung đoạn (d)'}];
      case 'cylinder': return [{id: 'r', label: 'Bán kính đáy (r)'}, {id: 'h', label: 'Chiều cao (h)'}];
      case 'cone': return [{id: 'r', label: 'Bán kính đáy (r)'}, {id: 'h', label: 'Chiều cao (h)'}, {id: 'l', label: 'Đường sinh (l)'}];
      case 'sphere': return [{id: 'r', label: 'Bán kính (r)'}];
      case 'triangle': return [{id: 'a', label: 'Cạnh (a)'}, {id: 'b', label: 'Cạnh (b)'}, {id: 'c', label: 'Cạnh (c)'}, {id: 'h', label: 'Chiều cao hạ xuống a (h)'}];
      case 'square': return [{id: 'a', label: 'Cạnh (a)'}];
      case 'rectangle': return [{id: 'a', label: 'Chiều dài (a)'}, {id: 'b', label: 'Chiều rộng (b)'}];
      case 'parallelogram': return [{id: 'a', label: 'Cạnh đáy (a)'}, {id: 'b', label: 'Cạnh bên (b)'}, {id: 'h', label: 'Chiều cao hạ xuống a (h)'}];
      case 'rhombus': return [{id: 'a', label: 'Cạnh (a)'}, {id: 'd1', label: 'Đường chéo 1 (d1)'}, {id: 'd2', label: 'Đường chéo 2 (d2)'}];
      case 'trapezoid': return [{id: 'a', label: 'Đáy lớn (a)'}, {id: 'b', label: 'Đáy nhỏ (b)'}, {id: 'c', label: 'Cạnh bên 1 (c)'}, {id: 'd', label: 'Cạnh bên 2 (d)'}, {id: 'h', label: 'Chiều cao (h)'}];
      default: return [];
    }
  };

  const parseVal = (val: string) => {
    if (!val) return 0;
    try {
      const replaced = val.replace(/π/g, 'Math.PI').replace(/√/g, 'Math.sqrt').replace(/\^/g, '**');
      // Very basic eval for inputs like 3*sqrt(2) or similar
      const evaled = new Function('return ' + replaced)();
      return isNaN(evaled) ? 0 : evaled;
    } catch {
      return 0;
    }
  };

  const calculate = () => {
    const vals: Record<string, number> = {};
    getFields().forEach(f => {
      vals[f.id] = parseVal(inputs[f.id]);
    });

    const formatPi = (valWithPi: number) => {
       if (keepPi) {
          if (valWithPi === 1) return 'π';
          return `${valWithPi}π`;
       }
       return String(Math.round(valWithPi * Math.PI * 1000) / 1000);
    };

    const formatNum = (val: number) => String(Math.round(val * 1000) / 1000);

    let perimeter = '';
    let area = '';
    let areaTotal = '';
    let volume = '';

    try {
      if (shape === 'rect_prism') {
        const {a, b, h} = vals;
        area = formatNum(2 * (a + b) * h);
        areaTotal = formatNum(2 * (a + b) * h + 2 * a * b);
        volume = formatNum(a * b * h);
      } else if (shape === 'cube') {
        const {a} = vals;
        area = formatNum(4 * a * a);
        areaTotal = formatNum(6 * a * a);
        volume = formatNum(a * a * a);
      } else if (shape === 'tri_prism') {
        const {a, b, c, h} = vals;
        area = formatNum((a + b + c) * h);
        // Using Heron's formula for base area
        const p = (a + b + c) / 2;
        const baseArea = Math.sqrt(p * (p - a) * (p - b) * (p - c)) || 0;
        areaTotal = formatNum((a + b + c) * h + 2 * baseArea);
        volume = formatNum(baseArea * h);
      } else if (shape === 'quad_prism') {
        const {a, b, c, d, h} = vals;
        area = formatNum((a + b + c + d) * h);
        areaTotal = 'Cần thêm diện tích đáy để tính';
        volume = 'Cần thêm diện tích đáy để tính';
      } else if (shape === 'tri_pyr') {
        const {a, h, d} = vals;
        area = formatNum(3 * a * d / 2);
        const baseArea = (a * a * Math.sqrt(3)) / 4;
        areaTotal = formatNum((3 * a * d / 2) + baseArea);
        volume = formatNum((1/3) * baseArea * h);
      } else if (shape === 'quad_pyr') {
        const {a, h, d} = vals;
        area = formatNum(2 * a * d); // (4*a/2)*d
        const baseArea = a * a;
        areaTotal = formatNum(2 * a * d + baseArea);
        volume = formatNum((1/3) * baseArea * h);
      } else if (shape === 'cylinder') {
        const {r, h} = vals;
        area = keepPi ? `${formatNum(2*r*h)}π` : formatNum(2 * Math.PI * r * h);
        areaTotal = keepPi ? `${formatNum(2*r*h + 2*r*r)}π` : formatNum(2 * Math.PI * r * h + 2 * Math.PI * r * r);
        volume = keepPi ? `${formatNum(r*r*h)}π` : formatNum(Math.PI * r * r * h);
      } else if (shape === 'cone') {
        const {r, h, l} = vals;
        area = keepPi ? `${formatNum(r*l)}π` : formatNum(Math.PI * r * l);
        areaTotal = keepPi ? `${formatNum(r*l + r*r)}π` : formatNum(Math.PI * r * l + Math.PI * r * r);
        volume = keepPi ? `${formatNum((1/3)*r*r*h)}π` : formatNum((1/3) * Math.PI * r * r * h);
      } else if (shape === 'sphere') {
        const {r} = vals;
        area = keepPi ? `${formatNum(4*r*r)}π` : formatNum(4 * Math.PI * r * r);
        volume = keepPi ? `${formatNum((4/3)*r*r*r)}π` : formatNum((4/3) * Math.PI * r * r * r);
      } else if (shape === 'triangle') {
        const {a, b, c, h} = vals;
        perimeter = formatNum(a + b + c);
        area = formatNum((a * h) / 2);
      } else if (shape === 'square') {
        const {a} = vals;
        perimeter = formatNum(4 * a);
        area = formatNum(a * a);
      } else if (shape === 'rectangle') {
        const {a, b} = vals;
        perimeter = formatNum(2 * (a + b));
        area = formatNum(a * b);
      } else if (shape === 'parallelogram') {
        const {a, b, h} = vals;
        perimeter = formatNum(2 * (a + b));
        area = formatNum(a * h);
      } else if (shape === 'rhombus') {
        const {a, d1, d2} = vals;
        perimeter = formatNum(4 * a);
        area = formatNum((d1 * d2) / 2);
      } else if (shape === 'trapezoid') {
        const {a, b, c, d, h} = vals;
        perimeter = formatNum(a + b + c + d);
        area = formatNum(((a + b) * h) / 2);
      }
    } catch {
      return { err: true };
    }

    return { perimeter, area, areaTotal, volume };
  };

  const result = calculate();
  const is2D = selectedShape?.category === '2D';

  return (
    <div className="w-full flex flex-col md:flex-row h-full">
      {/* Sidebar selection */}
      <div className="w-full md:w-64 bg-gray-50 border-r-2 border-gray-100 overflow-y-auto p-4 space-y-6">
        <div>
          <h3 className="font-black text-gray-400 uppercase text-xs tracking-widest mb-3">Hình Học Không Gian (3D)</h3>
          <div className="space-y-1">
            {SHAPES.filter(s => s.category === '3D').map(s => (
              <button 
                key={s.id}
                onClick={() => { setShape(s.id); setInputs({}); }}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold text-sm transition-all ${shape === s.id ? 'bg-[#D1FAE5] text-[#059669]' : 'text-gray-600 hover:bg-white'}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-black text-gray-400 uppercase text-xs tracking-widest mb-3">Hình Học Phẳng (2D)</h3>
          <div className="space-y-1">
            {SHAPES.filter(s => s.category === '2D').map(s => (
              <button 
                key={s.id}
                onClick={() => { setShape(s.id); setInputs({}); }}
                className={`w-full text-left px-3 py-2 rounded-xl font-bold text-sm transition-all ${shape === s.id ? 'bg-[#DBEAFE] text-[#2563EB]' : 'text-gray-600 hover:bg-white'}`}
              >
                {s.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex flex-col gap-8 overflow-y-auto">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-black text-[#0F172A]">{selectedShape?.name}</h2>
          {['cylinder', 'cone', 'sphere'].includes(shape) && (
            <label className="flex items-center gap-2 cursor-pointer bg-white px-4 py-2 rounded-xl shadow-sm border-2 border-gray-100">
              <input type="checkbox" checked={keepPi} onChange={e => setKeepPi(e.target.checked)} className="w-4 h-4 text-[#059669] rounded focus:ring-[#059669]" />
              <span className="font-bold text-gray-700 text-sm">Giữ nguyên số π</span>
            </label>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Inputs */}
          <div className="space-y-4 bg-gray-50 p-6 rounded-3xl border-2 border-gray-100">
            <h3 className="font-black text-[#64748B] uppercase tracking-wider text-sm mb-4">Nhập Dữ Liệu</h3>
            {getFields().map(f => (
              <div key={f.id}>
                <label className="block text-sm font-bold text-gray-700 mb-1">{f.label}</label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputs[f.id] || ''}
                    onChange={e => handleInputChange(f.id, e.target.value)}
                    placeholder="VD: 5, 2.5, 3*√2"
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#3B82F6] focus:outline-none font-bold text-[#0F172A]"
                  />
                  <div className="absolute right-2 top-2 flex gap-1">
                    <button onClick={() => handleInputChange(f.id, (inputs[f.id] || '') + '√')} className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600 hover:bg-gray-200">√</button>
                    {['cylinder', 'cone', 'sphere'].includes(shape) && <button onClick={() => handleInputChange(f.id, (inputs[f.id] || '') + 'π')} className="px-2 py-1 bg-gray-100 rounded text-xs font-bold text-gray-600 hover:bg-gray-200">π</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Outputs */}
          <div className="space-y-4">
            <h3 className="font-black text-[#64748B] uppercase tracking-wider text-sm mb-4">Kết Quả Tính Toán</h3>
            {is2D ? (
              <>
                <div className="bg-[#EFF6FF] p-6 rounded-3xl border-4 border-[#BFDBFE]">
                  <p className="text-[#3B82F6] font-bold text-sm mb-1 uppercase tracking-wider">Chu vi (C)</p>
                  <p className="text-3xl font-black text-[#1E3A8A]">{result.perimeter || '0'}</p>
                </div>
                <div className="bg-[#ECFDF5] p-6 rounded-3xl border-4 border-[#A7F3D0]">
                  <p className="text-[#059669] font-bold text-sm mb-1 uppercase tracking-wider">Diện tích (S)</p>
                  <p className="text-3xl font-black text-[#064E3B]">{result.area || '0'}</p>
                </div>
              </>
            ) : (
              <>
                {shape !== 'sphere' && (
                  <div className="bg-[#EFF6FF] p-6 rounded-3xl border-4 border-[#BFDBFE]">
                    <p className="text-[#3B82F6] font-bold text-sm mb-1 uppercase tracking-wider">Diện tích xung quanh (Sxq)</p>
                    <p className="text-3xl font-black text-[#1E3A8A]">{result.area || '0'}</p>
                  </div>
                )}
                <div className="bg-[#EEF2FF] p-6 rounded-3xl border-4 border-[#C7D2FE]">
                  <p className="text-[#4F46E5] font-bold text-sm mb-1 uppercase tracking-wider">Diện tích toàn phần (Stp)</p>
                  <p className="text-3xl font-black text-[#312E81]">{result.areaTotal || '0'}</p>
                </div>
                <div className="bg-[#ECFDF5] p-6 rounded-3xl border-4 border-[#A7F3D0]">
                  <p className="text-[#059669] font-bold text-sm mb-1 uppercase tracking-wider">Thể tích (V)</p>
                  <p className="text-3xl font-black text-[#064E3B]">{result.volume || '0'}</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
