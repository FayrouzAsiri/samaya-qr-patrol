-- Insert sample checkpoints
INSERT INTO public.checkpoints (name_ar, name_en, location, school, city, token, qr_url) VALUES
('مدخل المدرسة الرئيسي', 'Main School Entrance', 'البوابة الرئيسية', 'مدرسة الأمل الابتدائية', 'الرياض', 'CHK001', 'https://samaya-qr.vercel.app/scan/CHK001'),
('فناء المدرسة', 'School Courtyard', 'الفناء الداخلي', 'مدرسة الأمل الابتدائية', 'الرياض', 'CHK002', 'https://samaya-qr.vercel.app/scan/CHK002'),
('مختبر العلوم', 'Science Laboratory', 'الطابق الثاني - غرفة 201', 'مدرسة الأمل الابتدائية', 'الرياض', 'CHK003', 'https://samaya-qr.vercel.app/scan/CHK003'),
('مكتبة المدرسة', 'School Library', 'الطابق الأول - غرفة 105', 'مدرسة الأمل الابتدائية', 'الرياض', 'CHK004', 'https://samaya-qr.vercel.app/scan/CHK004'),
('صالة الرياضة', 'Gymnasium', 'المبنى الرياضي', 'مدرسة الأمل الابتدائية', 'الرياض', 'CHK005', 'https://samaya-qr.vercel.app/scan/CHK005'),
('مدخل المدرسة الرئيسي', 'Main School Entrance', 'البوابة الرئيسية', 'مدرسة النور المتوسطة', 'جدة', 'CHK006', 'https://samaya-qr.vercel.app/scan/CHK006'),
('مختبر الحاسوب', 'Computer Lab', 'الطابق الثالث - غرفة 301', 'مدرسة النور المتوسطة', 'جدة', 'CHK007', 'https://samaya-qr.vercel.app/scan/CHK007'),
('كافتيريا المدرسة', 'School Cafeteria', 'الطابق الأرضي', 'مدرسة النور المتوسطة', 'جدة', 'CHK008', 'https://samaya-qr.vercel.app/scan/CHK008');

-- Insert sample scans
INSERT INTO public.scans (checkpoint_id, user_name, status, notes, scanned_at) VALUES
((SELECT id FROM public.checkpoints WHERE token = 'CHK001'), 'أحمد محمد', 'جاهز', 'المدخل نظيف ومرتب', NOW() - INTERVAL '2 hours'),
((SELECT id FROM public.checkpoints WHERE token = 'CHK002'), 'فاطمة علي', 'يحتاج صيانة', 'يحتاج إصلاح الإضاءة', NOW() - INTERVAL '1 hour'),
((SELECT id FROM public.checkpoints WHERE token = 'CHK003'), 'محمد سالم', 'جاهز', 'المختبر جاهز للاستخدام', NOW() - INTERVAL '30 minutes'),
((SELECT id FROM public.checkpoints WHERE token = 'CHK004'), 'نورا أحمد', 'غير جاهز', 'يحتاج تنظيف', NOW() - INTERVAL '15 minutes'),
((SELECT id FROM public.checkpoints WHERE token = 'CHK006'), 'خالد عبدالله', 'جاهز', 'المدخل آمن ونظيف', NOW() - INTERVAL '3 hours'),
((SELECT id FROM public.checkpoints WHERE token = 'CHK007'), 'سارة محمد', 'يحتاج صيانة', 'أجهزة الحاسوب تحتاج تحديث', NOW() - INTERVAL '2 hours');
