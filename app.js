require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Student = require('./models/student');

const app = express();

// الاتصال بقاعدة بيانات MongoDB
const dbURI = process.env.MONGO_URI;

mongoose.connect(dbURI)
    .then(() => console.log('تم الاتصال بقاعدة البيانات بنجاح'))
    .catch(err => console.error('خطأ في الاتصال بقاعدة البيانات:', err));

// إعدادات Middleware
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); // لاستقبال البيانات من الـ Forms
app.use(methodOverride('_method')); // لدعم PUT و DELETE

// ================= مسارات التطبيق (Routes) =================

// 1. استعراض بيانات جميع الطلاب (Read)
app.get('/', async (req, res) => {
    const students = await Student.find().sort({ createdAt: -1 });
    res.render('index', { students });
});

// 2. عرض صفحة إضافة طالب جديد
app.get('/new', (req, res) => {
    res.render('new');
});

// 3. إضافة طالب جديد إلى قاعدة البيانات (Create)
app.post('/', async (req, res) => {
    await Student.create(req.body);
    res.redirect('/');
});

// 4. عرض صفحة تعديل بيانات طالب
app.get('/:id/edit', async (req, res) => {
    const student = await Student.findById(req.params.id);
    res.render('edit', { student });
});

// 5. حفظ التعديلات في قاعدة البيانات (Update)
app.put('/:id', async (req, res) => {
    await Student.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/');
});

// 6. حذف طالب (Delete)
app.delete('/:id', async (req, res) => {
    await Student.findByIdAndDelete(req.params.id);
    res.redirect('/');
});

// تشغيل الخادم
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`الخادم يعمل على الرابط: http://localhost:${PORT}`);
});
module.exports = app;
