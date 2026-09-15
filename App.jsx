import React, { useState } from 'react';

export default function BadmintonCoachApp() {
  // 1. 動態課程類型列表 (可自訂名稱、時長、預設價格)
  const [courseTypes, setCourseTypes] = useState([
    { id: '1', name: '一對一私人班', duration: '1小時', defaultPrice: 500 },
    { id: '2', name: '小班教學', duration: '2小時', defaultPrice: 250 },
  ]);
  const [newCourse, setNewCourse] = useState({ name: '', duration: '1小時', defaultPrice: '' });

  // 2. 學員資料列表
  const [students, setStudents] = useState([
    { id: 1, name: '張小明', phone: '91234567', level: '初級', notes: '習慣右手，想練高遠球' },
    { id: 2, name: '李阿華', phone: '98765432', level: '中級', notes: '主力練雙打平抽' }
  ]);
  const [searchQuery, setSearchQuery] = useState('');
  const [newStudent, setNewStudent] = useState({ name: '', phone: '', level: '初級', notes: '' });

  // 3. 排課紀錄列表
  const [schedule, setSchedule] = useState([
    { id: 1, studentName: '張小明', courseName: '一對一私人班', duration: '1小時', price: 500, isPaid: false, date: '2026-09-18', time: '19:00', court: '中山紀念公園體育館' },
    { id: 2, studentName: '李阿華', courseName: '小班教學', duration: '2小時', price: 250, isPaid: true, date: '2026-09-20', time: '10:00', court: '九龍灣體育館' }
  ]);

  // 頁面與控制狀態
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'students' | 'settings'
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [editingLessonId, setEditingLessonId] = useState(null);

  // 排課表單狀態
  const [lessonForm, setLessonForm] = useState({
    studentName: '', courseTypeId: '1', price: 500, date: '', time: '19:00', court: ''
  });

  // 篩選數據
  const monthlySchedule = schedule.filter(item => item.date.startsWith(selectedMonth));
  const totalRevenue = monthlySchedule.reduce((acc, item) => acc + item.price, 0);
  const paidRevenue = monthlySchedule.filter(item => item.isPaid).reduce((acc, item) => acc + item.price, 0);
  const unpaidRevenue = totalRevenue - paidRevenue;

  const filteredStudents = students.filter(s => 
    s.name.includes(searchQuery) || s.phone.includes(searchQuery)
  );

  // 切換課程類型時自動帶入價格
  const handleCourseTypeChange = (typeId) => {
    const selected = courseTypes.find(c => c.id === typeId);
    setLessonForm({ ...lessonForm, courseTypeId: typeId, price: selected ? selected.defaultPrice : 0 });
  };

  // 新增學員
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudent.name) return;
    setStudents([...students, { ...newStudent, id: Date.now() }]);
    setNewStudent({ name: '', phone: '', level: '初級', notes: '' });
  };

  // 保存排課 (新增/修改)
  const handleSaveLesson = (e) => {
    e.preventDefault();
    if (!lessonForm.studentName || !lessonForm.date) return;
    const selectedType = courseTypes.find(c => c.id === lessonForm.courseTypeId) || { name: '自訂課程', duration: '1小時' };

    if (editingLessonId) {
      setSchedule(schedule.map(item => item.id === editingLessonId ? {
        ...item,
        studentName: lessonForm.studentName,
        courseName: selectedType.name,
        duration: selectedType.duration,
        price: Number(lessonForm.price),
        date: lessonForm.date,
        time: lessonForm.time,
        court: lessonForm.court
      } : item));
      setEditingLessonId(null);
    } else {
      setSchedule([...schedule, {
        id: Date.now(),
        studentName: lessonForm.studentName,
        courseName: selectedType.name,
        duration: selectedType.duration,
        price: Number(lessonForm.price),
        isPaid: false,
        date: lessonForm.date,
        time: lessonForm.time,
        court: lessonForm.court || '未定'
      }]);
    }
    setLessonForm({ studentName: '', courseTypeId: courseTypes[0]?.id || '', price: courseTypes[0]?.defaultPrice || 0, date: '', time: '19:00', court: '' });
  };

  // 開始改期
  const handleStartEdit = (item) => {
    setEditingLessonId(item.id);
    const type = courseTypes.find(c => c.name === item.courseName) || courseTypes[0];
    setLessonForm({
      studentName: item.studentName,
      courseTypeId: type ? type.id : '',
      price: item.price,
      date: item.date,
      time: item.time,
      court: item.court
    });
  };

  // 取消課堂
  const handleCancelLesson = (id) => {
    if (window.confirm('確定要取消此課堂預約？')) {
      setSchedule(schedule.filter(item => item.id !== id));
    }
  };

  // 新增自訂課程類型
  const handleAddCourseType = (e) => {
    e.preventDefault();
    if (!newCourse.name || !newCourse.defaultPrice) return;
    setCourseTypes([
      ...courseTypes, 
      { ...newCourse, id: Date.now().toString(), defaultPrice: Number(newCourse.defaultPrice) }
    ]);
    setNewCourse({ name: '', duration: '1小時', defaultPrice: '' });
  };

  // 刪除課程類型
  const handleDeleteCourseType = (id) => {
    setCourseTypes(courseTypes.filter(c => c.id !== id));
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '15px', fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif', backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      
      <header style={{ textAlign: 'center', marginBottom: '15px' }}>
        <h1 style={{ fontSize: '20px', margin: '0 0 5px 0' }}>🏸 羽毛球教練工作板</h1>
      </header>

      {/* 頁面分頁切換 */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '15px' }}>
        <button onClick={() => setActiveTab('schedule')} style={{ flex: 1, padding: '10px 5px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeTab === 'schedule' ? '#007bff' : '#e9ecef', color: activeTab === 'schedule' ? '#fff' : '#333' }}>
          📅 課表收入
        </button>
        <button onClick={() => setActiveTab('students')} style={{ flex: 1, padding: '10px 5px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeTab === 'students' ? '#007bff' : '#e9ecef', color: activeTab === 'students' ? '#fff' : '#333' }}>
          👤 學員名冊
        </button>
        <button onClick={() => setActiveTab('settings')} style={{ flex: 1, padding: '10px 5px', borderRadius: '8px', border: 'none', fontWeight: 'bold', fontSize: '13px', backgroundColor: activeTab === 'settings' ? '#007bff' : '#e9ecef', color: activeTab === 'settings' ? '#fff' : '#333' }}>
          ⚙️ 課程設定
        </button>
      </div>

      {/* ================= 頁面 1：課表與收入統計 ================= */}
      {activeTab === 'schedule' && (
        <div>
          <div style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontWeight: 'bold', fontSize: '14px' }}>選擇月份：</span>
            <input type="month" value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)} style={{ padding: '6px', fontSize: '14px', borderRadius: '6px', border: '1px solid #ccc' }} />
          </div>

          <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '10px', boxShadow: '0 1px 4px rgba(0,0,0,0.08)', marginBottom: '15px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px', textAlign: 'center' }}>
            <div>
              <div style={{ fontSize: '11px', color: '#666' }}>預約總額</div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#007bff' }}>${totalRevenue}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#666' }}>已收款</div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#28a745' }}>${paidRevenue}</div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: '#666' }}>待收款</div>
              <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#dc3545' }}>${unpaidRevenue}</div>
            </div>
          </div>

          <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '10px', marginBottom: '15px', border: editingLessonId ? '2px solid #ffc107' : '1px solid #eee' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>{editingLessonId ? '✏️ 修改/改期課堂' : '➕ 新增預約課堂'}</h3>
            <form onSubmit={handleSaveLesson} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <select value={lessonForm.studentName} onChange={e => setLessonForm({...lessonForm, studentName: e.target.value})} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                <option value="">-- 選擇學員 --</option>
                {students.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
              </select>

              <div style={{ display: 'flex', gap: '8px' }}>
                <select value={lessonForm.courseTypeId} onChange={e => handleCourseTypeChange(e.target.value)} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}>
                  {courseTypes.map(c => <option key={c.id} value={c.id}>{c.name} ({c.duration})</option>)}
                </select>
                <input type="number" placeholder="學費" value={lessonForm.price} onChange={e => setLessonForm({...lessonForm, price: e.target.value})} style={{ width: '90px', padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <input type="date" value={lessonForm.date} onChange={e => setLessonForm({...lessonForm, date: e.target.value})} required style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
                <input type="time" value={lessonForm.time} onChange={e => setLessonForm({...lessonForm, time: e.target.value})} style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
              </div>

              <input placeholder="球場地點 (例: 九龍灣體育館)" value={lessonForm.court} onChange={e => setLessonForm({...lessonForm, court: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />

              <div style={{ display: 'flex', gap: '8px' }}>
                <button type="submit" style={{ flex: 1, padding: '10px', backgroundColor: editingLessonId ? '#ffc107' : '#28a745', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                  {editingLessonId ? '保存變更' : '確認預約'}
                </button>
                {editingLessonId && (
                  <button type="button" onClick={() => { setEditingLessonId(null); setLessonForm({ studentName: '', courseTypeId: courseTypes[0]?.id || '', price: courseTypes[0]?.defaultPrice || 0, date: '', time: '19:00', court: '' }); }} style={{ padding: '10px', backgroundColor: '#6c757d', color: '#fff', border: 'none', borderRadius: '6px' }}>
                    取消
                  </button>
                )}
              </div>
            </form>
          </div>

          <h3 style={{ fontSize: '15px' }}>📅 {selectedMonth} 課堂列表 ({monthlySchedule.length}堂)</h3>
          {monthlySchedule.length === 0 ? <p style={{ fontSize: '13px', color: '#888' }}>這個月暫時未有排課</p> : monthlySchedule.map(item => (
            <div key={item.id} style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '8px', marginBottom: '8px', borderLeft: item.isPaid ? '5px solid #28a745' : '5px solid #dc3545' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <strong>{item.studentName}</strong>
                <span style={{ fontSize: '12px', color: '#666' }}>{item.courseName} ({item.duration})</span>
              </div>
              <div style={{ fontSize: '12px', color: '#555', margin: '4px 0' }}>
                📅 {item.date} {item.time} | 📍 {item.court}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '14px' }}>HK$ {item.price}</span>
                <div style={{ display: 'flex', gap: '5px' }}>
                  <button onClick={() => setSchedule(schedule.map(s => s.id === item.id ? { ...s, isPaid: !s.isPaid } : s))} style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', fontSize: '11px', backgroundColor: item.isPaid ? '#e8f5e9' : '#ffebee', color: item.isPaid ? '#2e7d32' : '#c62828' }}>
                    {item.isPaid ? '已付' : '未付'}
                  </button>
                  <button onClick={() => handleStartEdit(item)} style={{ padding: '4px 8px', borderRadius: '4px', border: '1px solid #ccc', backgroundColor: '#fff', fontSize: '11px' }}>改期</button>
                  <button onClick={() => handleCancelLesson(item.id)} style={{ padding: '4px 8px', borderRadius: '4px', border: 'none', backgroundColor: '#ff4d4f', color: '#fff', fontSize: '11px' }}>取消</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ================= 頁面 2：學員資料與搜尋 ================= */}
      {activeTab === 'students' && (
        <div>
          <input 
            placeholder="🔍 搜尋學員姓名或電話..." 
            value={searchQuery} 
            onChange={e => setSearchQuery(e.target.value)} 
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ccc', marginBottom: '10px', boxSizing: 'border-box' }}
          />

          <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '10px', marginBottom: '15px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>➕ 新增學員</h3>
            <form onSubmit={handleAddStudent} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input placeholder="姓名" value={newStudent.name} onChange={e => setNewStudent({...newStudent, name: e.target.value})} required style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <input placeholder="電話" value={newStudent.phone} onChange={e => setNewStudent({...newStudent, phone: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }} />
              <textarea placeholder="備註 (例如：慣用手、想練技術...)" value={newStudent.notes} onChange={e => setNewStudent({...newStudent, notes: e.target.value})} style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc', height: '50px' }} />
              <button type="submit" style={{ padding: '8px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>儲存學員</button>
            </form>
          </div>

          <h3 style={{ fontSize: '15px' }}>👥 學員名冊 ({filteredStudents.length}人)</h3>
          {filteredStudents.map(s => (
            <div key={s.id} style={{ backgroundColor: '#fff', padding: '10px', borderRadius: '8px', marginBottom: '8px' }}>
              <strong>{s.name}</strong> <span style={{ fontSize: '12px', color: '#666' }}>({s.level})</span>
              <div style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>📞 {s.phone || '無電話'} | 📝 {s.notes || '無備註'}</div>
            </div>
          ))}
        </div>
      )}

      {/* ================= 頁面 3：自訂課程與價格設定 ================= */}
      {activeTab === 'settings' && (
        <div>
          <div style={{ backgroundColor: '#fff', padding: '12px', borderRadius: '10px', marginBottom: '15px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>➕ 新增課程類型</h3>
            <form onSubmit={handleAddCourseType} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input 
                placeholder="課程名稱 (例: 雙打專修班)" 
                value={newCourse.name} 
                onChange={e => setNewCourse({...newCourse, name: e.target.value})} 
                required 
                style={{ padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <input 
                  placeholder="時長 (例: 1.5小時)" 
                  value={newCourse.duration} 
                  onChange={e => setNewCourse({...newCourse, duration: e.target.value})} 
                  style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
                <input 
                  type="number" 
                  placeholder="預設學費 HK$" 
                  value={newCourse.defaultPrice} 
                  onChange={e => setNewCourse({...newCourse, defaultPrice: e.target.value})} 
                  required 
                  style={{ flex: 1, padding: '8px', borderRadius: '6px', border: '1px solid #ccc' }}
                />
              </div>
              <button type="submit" style={{ padding: '8px', backgroundColor: '#17a2b8', color: '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                + 新增至選單
              </button>
            </form>
          </div>

          <h3 style={{ fontSize: '15px' }}>⚙️ 現有課程類型</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {courseTypes.map(c => (
              <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', backgroundColor: '#fff', borderRadius: '8px' }}>
                <div>
                  <strong>{c.name}</strong> ({c.duration})
                  <div style={{ fontSize: '13px', color: '#28a745', fontWeight: 'bold' }}>HK$ {c.defaultPrice}</div>
                </div>
                <button onClick={() => handleDeleteCourseType(c.id)} style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: '#fff', border: 'none', borderRadius: '4px', fontSize: '12px' }}>
                  刪除
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}