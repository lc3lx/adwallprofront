"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Bot, User } from "@/components/ui/icon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

const contactInfo = {
  email: "mahmudadwallpro@gmail.com",
  facebook: "https://www.facebook.com/share/1a66tVz9jP/",
  instagram:
    "https://www.instagram.com/adwallpro?utm_source=qr&igsh=cmxqbnR1MmxxMTFq",
  tiktok: "https://www.tiktok.com/@adwall.pro?_t=ZS-900BMVZKa7U&_r=1",
  phone: "+1234567890",
};

const botResponses = {
  greeting: [
    "مرحباً بك في AdWallPro! 😊\nأنا مساعدك الذكي، كيف يمكنني مساعدتك اليوم؟",
    "أهلاً وسهلاً! 🚀\nأنا هنا لأجيب على أسئلتك وأقدم لك المساعدة.",
    "مرحباً! 💫\nاسألني عن أي شيء تريد معرفته عن منصتنا!",
  ],
  about: [
    "AdWallPro هي المنصة الذكية التي تجمع المعلنين والباحثين عن أفضل العروض! 🎯\n\n🏢 أقسام الموقع:\n• الصفحة الرئيسية - عرض الميزات والخدمات\n• التصنيفات - تصفح الشركات حسب الفئة\n• الشركات - اكتشف أفضل العروض والخدمات\n• لوحة التحكم - إدارة إعلاناتك بسهولة\n\nهل تريد معرفة المزيد عن قسم معين؟",
    "منصتنا مصممة خصيصاً لتجربة مثالية! 💎\n\n🎨 الميزات الرئيسية:\n• إضافة شركتك حسب التصنيف المناسب\n• لوحة تحكم متطورة لإدارة الإعلانات\n• تصفح آلاف الشركات المصنفة\n• نظام VIP متميز\n• تواصل مباشر مع العملاء\n\nأي قسم يهمك أكثر؟",
  ],
  services: [
    "خدماتنا متنوعة ومتطورة! 🌟\n\n🏷️ التصنيفات الذكية:\n• تصفح الشركات حسب الفئة\n• إضافة شركتك للتصنيف المناسب\n• تنظيم مثالي للعروض والخدمات\n\n📊 لوحة التحكم:\n• إدارة إعلاناتك بسهولة\n• متابعة الأداء والإحصائيات\n• تحديث المعلومات في أي وقت\n\n👑 خدمات VIP:\n• ميزات إضافية متقدمة\n• ظهور مميز في النتائج\n• دعم فني مخصص\n\nأي خدمة تريد معرفة المزيد عنها؟",
    "نقدم حلول شاملة لجميع احتياجاتك! 📈\n\n🎯 كيف يعمل النظام:\n• اختر التصنيف المناسب لشركتك\n• أضف معلوماتك وعروضك\n• استخدم لوحة التحكم لإدارة الإعلانات\n• تابع الأداء والإحصائيات\n\n💡 لماذا AdWallPro؟\n• منصة موثوقة وآمنة\n• واجهة سهلة الاستخدام\n• دعم فني متواصل\n• أسعار تنافسية\n\nهل لديك سؤال محدد عن خدمة معينة؟",
  ],
  contact: [
    `يمكنك التواصل معنا عبر عدة طرق! 📞\n\n📧 البريد الإلكتروني:\n${contactInfo.email}\n\n📘 فيسبوك:\n${contactInfo.facebook}\n\n📸 إنستغرام:\n${contactInfo.instagram}\n\n🎵 تيك توك:\n${contactInfo.tiktok}\n\n📞 الهاتف:\n${contactInfo.phone}\n\nأي طريقة تفضلها؟`,
    `نحن متاحون على جميع المنصات! 💬\n\nاختر طريقة التواصل التي تناسبك:\n\n🔹 البريد الإلكتروني للاستفسارات الرسمية\n🔹 وسائل التواصل الاجتماعي للمتابعة اليومية\n🔹 الهاتف للاستفسارات العاجلة\n\nكيف تفضل التواصل معنا؟`,
  ],
  help: [
    "يمكنني مساعدتك في عدة مواضيع! 📚\n\n🏢 أقسام الموقع:\n• الصفحة الرئيسية - الميزات والخدمات\n• التصنيفات - تصفح الشركات حسب الفئة\n• الشركات - اكتشاف العروض والخدمات\n• لوحة التحكم - إدارة الإعلانات\n\n💼 الخدمات:\n• إضافة شركتك حسب التصنيف\n• إدارة الإعلانات والتحديثات\n• متابعة الأداء والإحصائيات\n• التواصل مع العملاء\n\n📞 معلومات التواصل:\n• البريد الإلكتروني\n• وسائل التواصل الاجتماعي\n• الهاتف والدعم الفني\n\nما الذي تريد معرفته؟",
    "أنا هنا لمساعدتك في كل شيء! 💭\n\n🎯 اسألني عن:\n• كيفية إضافة شركتك\n• التصنيفات والفئات المتاحة\n• لوحة التحكم والداشبورد\n• خدمات التسويق والدعاية\n• طرق التواصل والدعم\n• أي استفسار آخر\n\n💡 نصائح:\n• اختر التصنيف المناسب لشركتك\n• استخدم وصف جذاب ومفصل\n• حدث معلوماتك بانتظام\n• تفاعل مع العملاء بسرعة\n\nما سؤالك؟",
  ],
  default: [
    "شكراً لك على سؤالك! 💫\n\nيمكنني مساعدتك في:\n• معلومات عن المنصة\n• الخدمات المتاحة\n• طرق التواصل\n• أي استفسار آخر\n\nما الذي تهمك معرفته؟",
    "ممتاز! 🤔\n\nهل تريد معرفة:\n• خدمات AdWallPro؟\n• كيفية استخدام المنصة؟\n• طرق التواصل معنا؟\n• شيء آخر؟\n\nاختر ما يناسبك!",
    "أنا هنا لمساعدتك! 🚀\n\nاسألني عن أي شيء متعلق بـ:\n• منصة AdWallPro\n• الخدمات والمواصفات\n• التواصل والدعم\n• أي موضوع آخر\n\nما الذي يمكنني مساعدتك فيه؟",
  ],
};

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "مرحباً! أنا مساعد AdWallPro الذكي 🤖\nكيف يمكنني مساعدتك اليوم؟",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // دالة لجلب التصنيفات
  const fetchCategories = async () => {
    try {
      const response = await fetch("https://adwallpro.com/api/v1/categories");
      if (response.ok) {
        const data = await response.json();
        return data.data || data;
      }
      return [];
    } catch (error) {
      console.error("فشل في جلب التصنيفات:", error);
      return [];
    }
  };

  // دالة لجلب الشركات
  const fetchCompanies = async (searchQuery?: string) => {
    try {
      let url = "https://adwallpro.com/api/v1/companies";
      if (searchQuery) {
        url += `?search=${encodeURIComponent(searchQuery)}`;
      }

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        return data.data || data;
      }
      return [];
    } catch (error) {
      console.error("فشل في جلب الشركات:", error);
      return [];
    }
  };

  // دالة لجلب الشركات حسب التصنيف
  const fetchCompaniesByCategory = async (categoryId: string) => {
    try {
      const response = await fetch(
        `https://adwallpro.com/api/v1/companies/category/${categoryId}`
      );
      if (response.ok) {
        const data = await response.json();
        return data.data || data;
      }
      return [];
    } catch (error) {
      console.error("فشل في جلب الشركات حسب التصنيف:", error);
      return [];
    }
  };

  const getBotResponse = async (userMessage: string): Promise<string> => {
    const message = userMessage.toLowerCase();

    // الترحيب والتحيات
    if (
      message.includes("مرحبا") ||
      message.includes("اهلا") ||
      message.includes("السلام") ||
      message.includes("صباح") ||
      message.includes("مساء") ||
      message.includes("هلا")
    ) {
      return botResponses.greeting[
        Math.floor(Math.random() * botResponses.greeting.length)
      ];
    }

    // معلومات التواصل
    if (
      message.includes("تواصل") ||
      message.includes("اتصال") ||
      message.includes("اتصل") ||
      message.includes("ايميل") ||
      message.includes("بريد") ||
      message.includes("فيسبوك") ||
      message.includes("انستغرام") ||
      message.includes("تيك توك") ||
      message.includes("هاتف") ||
      message.includes("رقم") ||
      message.includes("رابط") ||
      message.includes("صفحة")
    ) {
      return botResponses.contact[
        Math.floor(Math.random() * botResponses.contact.length)
      ];
    }

    // التصنيفات والفئات - جلب من API
    if (
      message.includes("تصنيف") ||
      message.includes("تصنيفات") ||
      message.includes("فئة") ||
      message.includes("فئات") ||
      message.includes("قسم") ||
      message.includes("أقسام") ||
      message.includes("category") ||
      message.includes("categories") ||
      message.includes("إضافة شركة") ||
      message.includes("أضيف شركتي") ||
      message.includes("شركتي") ||
      message.includes("إعلان") ||
      message.includes("إعلانات")
    ) {
      setIsTyping(true);
      const categories = await fetchCategories();
      setIsTyping(false);

      if (categories && categories.length > 0) {
        let responseText =
          "🏷️ التصنيفات المتاحة في AdWallPro! 🎯\n\n📋 التصنيفات الحالية:\n";

        categories.slice(0, 8).forEach((category: any, index: number) => {
          const categoryName =
            category.nameAr || category.nameEn || "تصنيف غير محدد";
          responseText += `• ${categoryName}\n`;
        });

        if (categories.length > 8) {
          responseText += `• و ${categories.length - 8} تصنيفات أخرى!\n`;
        }

        responseText +=
          "\n💡 كيف يعمل النظام:\n• اختر التصنيف المناسب لشركتك\n• أضف معلوماتك وعروضك\n• اربط شركتك بالتصنيف الصحيح\n\n🎯 فوائد التصنيف:\n• وصول مباشر للعملاء المهتمين\n• تنظيم مثالي للعروض\n• سهولة البحث والوصول\n\nهل تريد معرفة الشركات في تصنيف معين؟";

        return responseText;
      } else {
        return "🏷️ التصنيفات والفئات في AdWallPro! 🎯\n\n📋 كيف يعمل النظام:\n• تصفح التصنيفات المختلفة\n• اختر التصنيف المناسب لشركتك\n• أضف معلوماتك وعروضك\n• اربط شركتك بالتصنيف الصحيح\n\n💡 لماذا التصنيف مهم؟\n• يساعد العملاء في العثور عليك بسهولة\n• يضمن ظهورك للعملاء المهتمين\n• ينظم العروض والخدمات\n\nهل تريد معرفة كيفية إضافة شركتك؟";
      }
    }

    // لوحة التحكم والداشبورد
    if (
      message.includes("داشبورد") ||
      message.includes("داش بورد") ||
      message.includes("لوحة التحكم") ||
      message.includes("لوحة") ||
      message.includes("dashboard") ||
      message.includes("إدارة") ||
      message.includes("إدارة الإعلانات") ||
      message.includes("إحصائيات") ||
      message.includes("متابعة") ||
      message.includes("تحديث") ||
      message.includes("تحرير") ||
      message.includes("تعديل")
    ) {
      return "📊 لوحة التحكم المتطورة! 🚀\n\n🎯 ما يمكنك فعله:\n• إدارة إعلاناتك بسهولة\n• تحديث معلومات شركتك\n• متابعة الأداء والإحصائيات\n• مراجعة الرسائل والطلبات\n• تعديل العروض والأسعار\n\n💡 الميزات المتاحة:\n• عرض تفصيلي للإحصائيات\n• إدارة المحتوى والصور\n• متابعة الزوار والتفاعل\n• تحديث الحالة والمعلومات\n• إدارة الحساب والإعدادات\n\n🔧 سهولة الاستخدام:\n• واجهة بسيطة وواضحة\n• تحديثات فورية\n• حفظ تلقائي للتغييرات\n• دعم فني متواصل\n\nهل تريد معرفة كيفية الوصول للوحة التحكم؟";
    }

    // عن المنصة
    if (
      message.includes("منصة") ||
      message.includes("ما هو") ||
      message.includes("عن") ||
      message.includes("adwallpro") ||
      message.includes("ادوول") ||
      message.includes("شركة") ||
      message.includes("موقع") ||
      message.includes("تطبيق")
    ) {
      return botResponses.about[
        Math.floor(Math.random() * botResponses.about.length)
      ];
    }

    // الخدمات
    if (
      message.includes("خدمات") ||
      message.includes("خدمة") ||
      message.includes("ماذا تقدم") ||
      message.includes("ميزات") ||
      message.includes("مميزات") ||
      message.includes("عرض") ||
      message.includes("باقة") ||
      message.includes("vip") ||
      message.includes("فايب")
    ) {
      return botResponses.services[
        Math.floor(Math.random() * botResponses.services.length)
      ];
    }

    // المشاكل والدعم الفني
    if (
      message.includes("مشكلة") ||
      message.includes("مشاكل") ||
      message.includes("خطأ") ||
      message.includes("error") ||
      message.includes("لا يعمل") ||
      message.includes("مش شغال") ||
      message.includes("مش عارف") ||
      message.includes("مش فاهم") ||
      message.includes("صعبة") ||
      message.includes("معقد") ||
      message.includes("دعم") ||
      message.includes("فني") ||
      message.includes("مساعدة فورية") ||
      message.includes("مشكلة تقنية") ||
      message.includes("bug") ||
      message.includes("تعطل") ||
      message.includes("مشكلة في") ||
      message.includes("ما في") ||
      message.includes("مافيش") ||
      message.includes("مش راضي") ||
      message.includes("مش راضي يشتغل")
    ) {
      return `أفهم مشكلتك! 😔\n\nفريق الدعم الفني جاهز لمساعدتك فوراً! 🚀\n\n📞 تواصل معنا الآن:\n\n📧 البريد الإلكتروني:\n${contactInfo.email}\n\n📘 فيسبوك:\n${contactInfo.facebook}\n\n📸 إنستغرام:\n${contactInfo.instagram}\n\n📞 الهاتف:\n${contactInfo.phone}\n\n🔧 سنحل مشكلتك في أقرب وقت ممكن!\n\nهل تريد مني أن أوضح لك كيفية الوصول لأي من هذه الطرق؟`;
    }

    // الحال والتحيات اليومية
    if (
      message.includes("كيفك") ||
      message.includes("كيف حالك") ||
      message.includes("شلونك") ||
      message.includes("أخبارك") ||
      message.includes("كيف صار") ||
      (message.includes("كيف") && message.includes("حالك")) ||
      (message.includes("كيف") && message.includes("حال")) ||
      message.includes("وينك") ||
      message.includes("شلون") ||
      message.includes("كيف الوضع")
    ) {
      return "الحمد لله بخير! 😊\n\nأنا بخير وسعيد لخدمتك اليوم!\n\nكيف حالك أنت؟ هل تحتاج مساعدة في شيء معين؟\n\nيمكنني مساعدتك في:\n• معلومات عن AdWallPro\n• الخدمات المتاحة\n• حل المشاكل التقنية\n• طرق التواصل\n\nإيش في بالك؟ 🤔";
    }

    // البحث عن الشركات - جلب من API
    if (
      message.includes("شركة") ||
      message.includes("شركات") ||
      message.includes("مطعم") ||
      message.includes("مطاعم") ||
      message.includes("كوفي") ||
      message.includes("صالون") ||
      message.includes("صالونات") ||
      message.includes("محل") ||
      message.includes("محلات") ||
      message.includes("مكتب") ||
      message.includes("مكاتب") ||
      message.includes("عيادة") ||
      message.includes("عيادات") ||
      message.includes("مدرسة") ||
      message.includes("مدارس") ||
      message.includes("مركز") ||
      message.includes("مراكز") ||
      message.includes("معرض") ||
      message.includes("معارض") ||
      message.includes("مشروع") ||
      message.includes("مشاريع") ||
      message.includes("خدمة") ||
      message.includes("خدمات") ||
      message.includes("بقالة") ||
      message.includes("سوبر ماركت") ||
      message.includes("صيدلية") ||
      message.includes("صيدليات") ||
      message.includes("مستشفى") ||
      message.includes("مستشفيات") ||
      message.includes("فندق") ||
      message.includes("فنادق") ||
      message.includes("مقاول") ||
      message.includes("مقاولات") ||
      message.includes("كهربائي") ||
      message.includes("سباك") ||
      message.includes("نجار") ||
      message.includes("حداد") ||
      message.includes("ميكانيكي") ||
      message.includes("تاكسي") ||
      message.includes("نقل") ||
      message.includes("شحن") ||
      message.includes("توصيل") ||
      message.includes("تطبيق") ||
      message.includes("برمجة") ||
      message.includes("تصميم") ||
      message.includes("تسويق") ||
      message.includes("إعلان") ||
      message.includes("دعاية") ||
      message.includes("ترويج") ||
      message.includes("بيع") ||
      message.includes("عميل") ||
      message.includes("عملاء") ||
      message.includes("زبون") ||
      message.includes("زباين") ||
      message.includes("عميل جديد") ||
      message.includes("زيادة المبيعات") ||
      message.includes("نمو") ||
      message.includes("توسع") ||
      message.includes("شهرة") ||
      message.includes("معروف")
    ) {
      setIsTyping(true);

      // استخراج كلمات البحث من الرسالة
      const searchTerms = userMessage
        .split(" ")
        .filter(
          (word) =>
            word.length > 2 &&
            ![
              "في",
              "من",
              "إلى",
              "على",
              "عن",
              "مع",
              "لك",
              "لي",
              "له",
              "لها",
              "لهم",
              "هن",
              "هي",
              "هو",
              "هما",
              "هما",
              "أنت",
              "أنت",
              "أنا",
              "نحن",
              "هم",
              "هن",
            ].includes(word)
        );

      const searchQuery = searchTerms.join(" ");
      const companies = await fetchCompanies(searchQuery);
      setIsTyping(false);

      if (companies && companies.length > 0) {
        let responseText = `🔍 نتائج البحث عن "${
          searchQuery || "الشركات"
        }" 📊\n\n`;

        companies.slice(0, 5).forEach((company: any, index: number) => {
          const companyName = company.companyName || "شركة غير محددة";
          const city = company.city || "غير محدد";
          const description = company.description
            ? company.description.substring(0, 100) + "..."
            : "لا يوجد وصف";

          responseText += `${index + 1}. **${companyName}**\n`;
          responseText += `   📍 ${city}\n`;
          responseText += `   📝 ${description}\n`;

          if (company.whatsapp) responseText += `   📱 WhatsApp متوفر\n`;
          if (company.email) responseText += `   📧 Email متوفر\n`;
          if (company.website) responseText += `   🌐 موقع إلكتروني متوفر\n`;

          responseText += `\n`;
        });

        if (companies.length > 5) {
          responseText += `و ${companies.length - 5} شركات أخرى متاحة!\n\n`;
        }

        responseText += `💡 هل تريد معرفة المزيد عن شركة معينة؟\nأم تبحث عن شيء محدد؟`;

        return responseText;
      } else {
        return `🔍 لم أجد شركات مطابقة لبحثك "${
          searchQuery || ""
        }" 📊\n\n💡 جرب البحث بـ:\n• اسم الشركة\n• نوع الخدمة\n• المدينة\n• التصنيف\n\nأم هل تريد معرفة التصنيفات المتاحة؟`;
      }
    }

    // التسويق والدعاية
    if (
      message.includes("تسويق") ||
      message.includes("دعاية") ||
      message.includes("ترويج") ||
      message.includes("بيع") ||
      message.includes("عميل") ||
      message.includes("عملاء") ||
      message.includes("زبون") ||
      message.includes("زباين") ||
      message.includes("عميل جديد") ||
      message.includes("زيادة المبيعات") ||
      message.includes("نمو") ||
      message.includes("توسع") ||
      message.includes("شهرة") ||
      message.includes("معروف")
    ) {
      return "🚀 التسويق والدعاية مع AdWallPro! 💰\n\n🎯 لماذا AdWallPro للمسوقين؟\n• منصة متخصصة في الإعلانات المحلية\n• وصول مباشر للعملاء المهتمين\n• تصنيف ذكي يضمن الظهور المناسب\n• أدوات متطورة لقياس الأداء\n\n📈 فوائد التسويق:\n• زيادة عدد العملاء الجدد\n• تحسين الصورة التجارية\n• سهولة التواصل مع العملاء\n• متابعة النتائج والإحصائيات\n\n💡 نصائح للنجاح:\n• اختر التصنيف المناسب بدقة\n• اكتب وصف جذاب ومفصل\n• استخدم صور عالية الجودة\n• حدث معلوماتك بانتظام\n• تفاعل مع العملاء بسرعة\n\n🎨 ميزات التسويق:\n• ظهور مميز في النتائج\n• إحصائيات مفصلة للأداء\n• إمكانية التحديث المستمر\n• دعم فني مخصص\n\nهل تريد معرفة كيفية بدء التسويق معنا؟";
    }

    // المساعدة العامة
    if (
      message.includes("مساعدة") ||
      message.includes("مساعد") ||
      message.includes("ساعد") ||
      message.includes("كيف") ||
      message.includes("ماذا") ||
      message.includes("متى") ||
      message.includes("أين") ||
      message.includes("لماذا") ||
      message.includes("؟") ||
      message.includes("؟؟")
    ) {
      return botResponses.help[
        Math.floor(Math.random() * botResponses.help.length)
      ];
    }

    // ردود ذكية على أسئلة شخصية
    if (
      message.includes("اسمك") ||
      message.includes("مين انت") ||
      message.includes("انت مين") ||
      message.includes("شو اسمك") ||
      message.includes("عرفني عنك") ||
      message.includes("انت ايش") ||
      message.includes("مين انتي")
    ) {
      return "أنا مساعد AdWallPro الذكي! 🤖\n\nاسمي AdBot، وأنا هنا لمساعدتك في كل ما يتعلق بمنصة AdWallPro!\n\nيمكنني:\n• الإجابة على أسئلتك\n• تقديم معلومات عن الخدمات\n• مساعدتك في حل المشاكل\n• توجيهك لطرق التواصل\n\nإيش في بالك؟ كيف يمكنني أساعدك اليوم؟ 😊";
    }

    // ردود على أسئلة عن العمر والوقت
    if (
      message.includes("كم عمرك") ||
      message.includes("قديم") ||
      message.includes("جديد") ||
      message.includes("من متى") ||
      (message.includes("متى") && message.includes("عملت")) ||
      message.includes("من وين") ||
      message.includes("وين انت")
    ) {
      return "أنا مساعد جديد ومتطور! 🚀\n\nتم تطويري خصيصاً لخدمة زوار AdWallPro بأفضل طريقة ممكنة!\n\nأنا دائماً متاح لخدمتك 24/7! ⏰\n\nهل تريد معرفة المزيد عن خدمات AdWallPro؟ أم لديك سؤال محدد؟ 🤔";
    }

    // شكر ومجاملة
    if (
      message.includes("شكرا") ||
      message.includes("شكراً") ||
      message.includes("ممتاز") ||
      message.includes("رائع") ||
      message.includes("حلو") ||
      message.includes("مفيد") ||
      message.includes("أشكرك") ||
      message.includes("زبط") ||
      message.includes("مشكور") ||
      message.includes("تسلم") ||
      message.includes("الله يعطيك") ||
      message.includes("بارك الله")
    ) {
      return "العفو! 😊\n\nأنا سعيد لأنني استطعت مساعدتك!\n\nهذا واجبي! 💪\n\nهل لديك أي أسئلة أخرى؟\n\nيمكنني مساعدتك في:\n• معلومات عن المنصة\n• الخدمات المتاحة\n• حل المشاكل التقنية\n• طرق التواصل\n• أي استفسار آخر\n\nأنا هنا دائماً! 🤖";
    }

    // ردود على الإحباط والغضب
    if (
      message.includes("زعلان") ||
      message.includes("زعلانة") ||
      message.includes("مضايق") ||
      message.includes("مضايقة") ||
      message.includes("غاضب") ||
      message.includes("غاضبة") ||
      message.includes("مش عاجبني") ||
      message.includes("مش عاجب") ||
      message.includes("زعلت") ||
      message.includes("زعلتني") ||
      message.includes("مش حلو") ||
      message.includes("مش راضي") ||
      message.includes("مش عاجبك") ||
      message.includes("غضبان") ||
      message.includes("غضبانه")
    ) {
      return "أعتذر إذا كان هناك شيء مزعج! 😔\n\nأنا هنا لمساعدتك وحل أي مشكلة تواجهها! 💪\n\nفريق الدعم الفني جاهز لمساعدتك فوراً:\n\n📧 ${contactInfo.email}\n📘 ${contactInfo.facebook}\n📸 ${contactInfo.instagram}\n📞 ${contactInfo.phone}\n\nسنحل مشكلتك بأسرع وقت ممكن! 🚀\n\nهل تريد أن أساعدك في شيء آخر؟";
    }

    // ردود على السعادة والرضا
    if (
      message.includes("سعيد") ||
      message.includes("سعيدة") ||
      message.includes("فرحان") ||
      message.includes("فرحانة") ||
      message.includes("مبسوط") ||
      message.includes("مبسوطة") ||
      message.includes("راضي") ||
      message.includes("راضية") ||
      message.includes("عاجبني") ||
      message.includes("حلو") ||
      message.includes("ممتاز") ||
      message.includes("رائع") ||
      message.includes("زبط") ||
      message.includes("تمام") ||
      message.includes("ماشي")
    ) {
      return "أهلاً وسهلاً! 😊\n\nأنا سعيد لأنك سعيد! 🎉\n\nهذا يجعلني أكثر سعادة لخدمتك!\n\nهل تريد معرفة المزيد عن AdWallPro؟\nأم لديك أي أسئلة أخرى؟\n\nأنا هنا دائماً لخدمتك! 🤖✨";
    }

    // وداع
    if (
      message.includes("وداع") ||
      message.includes("مع السلامة") ||
      message.includes("باي") ||
      message.includes("الى اللقاء") ||
      message.includes("خلاص") ||
      message.includes("كفاية") ||
      message.includes("يالله") ||
      message.includes("يلا") ||
      message.includes("مشكورين") ||
      message.includes("الله يسلمكم")
    ) {
      return "مع السلامة! 👋\n\nأتمنى أن أكون قد استطعت مساعدتك!\n\nنراكم قريباً في AdWallPro! 🚀\n\nلأي استفسارات مستقبلية، لا تترددوا في العودة!\n\nأنا هنا دائماً لخدمتكم! 💫🤖";
    }

    // ردود افتراضية ذكية
    return botResponses.default[
      Math.floor(Math.random() * botResponses.default.length)
    ];
  };

  const sendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue("");

    // محاكاة تأخير الاستجابة
    setTimeout(async () => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: await getBotResponse(currentInput),
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <>
      {/* زر فتح البوت */}
      {!isOpen && (
        <div className="fixed bottom-6 left-6 z-50">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
            size="icon"
          >
            <MessageCircle className="h-6 w-6 text-white" />
          </Button>
          <div className="absolute -top-2 -right-2 h-5 w-5 bg-green-500 rounded-full flex items-center justify-center">
            <div className="h-2 w-2 bg-white rounded-full animate-pulse"></div>
          </div>
          {/* نص ترحيبي */}
          <div className="absolute bottom-16 left-0 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-2 shadow-lg border max-w-xs">
            <p className="text-sm text-gray-700 font-medium">
              مرحباً! 👋
              <br />
              كيف يمكنني مساعدتك؟
            </p>
            <div className="absolute bottom-[-6px] left-4 w-3 h-3 bg-white/95 rotate-45 border-r border-b"></div>
          </div>
        </div>
      )}

      {/* نافذة البوت */}
      {isOpen && (
        <div className="fixed bottom-6 left-6 z-50 w-80 h-96">
          <Card className="h-full shadow-2xl border-0 bg-white/95 backdrop-blur-sm">
            <CardHeader className="pb-3 bg-gradient-to-r from-primary to-primary/80 text-white rounded-t-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm">مساعد AdWallPro</h3>
                    <p className="text-xs opacity-90">متصل الآن</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsOpen(false)}
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="p-0 flex flex-col h-full">
              {/* منطقة الرسائل */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50/50">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isBot ? "justify-start" : "justify-end"
                    }`}
                  >
                    <div
                      className={`flex items-start gap-2 max-w-[80%] ${
                        message.isBot ? "flex-row" : "flex-row-reverse"
                      }`}
                    >
                      <div
                        className={`h-6 w-6 rounded-full flex items-center justify-center text-xs ${
                          message.isBot
                            ? "bg-primary text-white"
                            : "bg-gray-200 text-gray-600"
                        }`}
                      >
                        {message.isBot ? (
                          <Bot className="h-3 w-3" />
                        ) : (
                          <User className="h-3 w-3" />
                        )}
                      </div>
                      <div
                        className={`rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                          message.isBot
                            ? "bg-white text-gray-800 shadow-sm"
                            : "bg-primary text-white"
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  </div>
                ))}

                {/* مؤشر الكتابة */}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="flex items-start gap-2 max-w-[80%] flex-row">
                      <div className="h-6 w-6 rounded-full flex items-center justify-center text-xs bg-primary text-white">
                        <Bot className="h-3 w-3" />
                      </div>
                      <div className="rounded-2xl px-3 py-2 text-sm bg-white text-gray-800 shadow-sm">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.1s" }}
                          ></div>
                          <div
                            className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                            style={{ animationDelay: "0.2s" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* منطقة الإدخال */}
              <div className="p-4 border-t bg-white">
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="اكتب رسالتك هنا..."
                    className="flex-1 text-sm"
                  />
                  <Button
                    onClick={sendMessage}
                    size="icon"
                    className="h-10 w-10 bg-primary hover:bg-primary/90"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">
                  مساعد ذكي لخدمتك 24/7 🤖
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
