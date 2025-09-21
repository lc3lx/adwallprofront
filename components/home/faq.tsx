"use client";

import { useState } from "react";
import { useI18n } from "@/providers/lang-provider";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, HelpCircle, Sparkles } from "@/components/ui/icon";
import { cn } from "@/lib/utils";

export function FAQSection() {
  const { t, locale } = useI18n();
  const [openItems, setOpenItems] = useState<number[]>([0]);

  const toggleItem = (index: number) => {
    setOpenItems((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const faqs = [
    {
      questionAr: "ما هو AdWell؟",
      questionEn: "What is AdWell?",
      answerAr:
        "AdWell هي منصة إعلانية رقمية حديثة تتيح للشركات والأفراد عرض إعلاناتهم في مربعات منظمة على لوحة إعلانية تفاعلية.",
      answerEn:
        "AdWell is a modern digital advertising platform that allows companies and individuals to display their ads in organized squares on an interactive advertising board.",
    },
    {
      questionAr: "كيف يمكنني إضافة إعلان؟",
      questionEn: "How can I add an advertisement?",
      answerAr:
        "يمكنك إضافة إعلانك بسهولة من خلال النقر على 'أضف إعلان' واختيار المربع المناسب وملء البيانات المطلوبة.",
      answerEn:
        "You can easily add your ad by clicking 'Add Ad', choosing the appropriate square, and filling in the required information.",
    },
    {
      questionAr: "هل الخدمة مجانية؟",
      questionEn: "Is the service free?",
      answerAr:
        "نعم، الخدمة مجانية حالياً مع نظام موافقة الإدارة للتأكد من جودة المحتوى.",
      answerEn:
        "Yes, the service is currently free with an admin approval system to ensure content quality.",
    },
    {
      questionAr: "كم يستغرق وقت الموافقة على الإعلان؟",
      questionEn: "How long does ad approval take?",
      answerAr:
        "عادة ما يتم مراجعة الإعلانات والموافقة عليها خلال 24-48 ساعة من تاريخ التقديم.",
      answerEn:
        "Ads are usually reviewed and approved within 24-48 hours from submission.",
    },
    {
      questionAr: "ما هي أنواع الإعلانات المسموحة؟",
      questionEn: "What types of ads are allowed?",
      answerAr:
        "نقبل جميع أنواع الإعلانات التجارية والخدمية المشروعة التي تتوافق مع القوانين المحلية والدولية.",
      answerEn:
        "We accept all types of legitimate commercial and service advertisements that comply with local and international laws.",
    },
    {
      questionAr: "كيف يمكنني تعديل إعلاني؟",
      questionEn: "How can I edit my ad?",
      answerAr:
        "يمكنك تعديل إعلانك من خلال لوحة التحكم الخاصة بك أو التواصل مع فريق الدعم.",
      answerEn:
        "You can edit your ad through your control panel or by contacting the support team.",
    },
    {
      questionAr: "هل يمكنني حذف إعلاني؟",
      questionEn: "Can I delete my ad?",
      answerAr:
        "نعم، يمكنك حذف إعلانك في أي وقت من خلال لوحة التحكم أو طلب الحذف من الإدارة.",
      answerEn:
        "Yes, you can delete your ad at any time through the control panel or request deletion from admin.",
    },
    {
      questionAr: "كيف يمكنني التواصل مع الدعم؟",
      questionEn: "How can I contact support?",
      answerAr:
        "يمكنك التواصل معنا عبر البريد الإلكتروني أو نموذج التواصل المتاح في الموقع.",
      answerEn:
        "You can contact us via email or through the contact form available on the website.",
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-muted/30 to-background">
      <div className="container max-w-4xl mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-primary/10 to-purple-600/10 border border-primary/20 mb-8">
            <HelpCircle className="h-5 w-5 text-primary animate-pulse" />
            <span className="text-sm font-bold bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {t("faqTitle")}
            </span>
          </div>

          <h2 className="text-4xl lg:text-5xl font-black mb-4">
            <span className="bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              {t("faqTitle")}
            </span>
          </h2>
          <p className="text-xl text-muted-foreground">{t("faqSubtitle")}</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openItems.includes(index);
            const question = locale === "ar" ? faq.questionAr : faq.questionEn;
            const answer = locale === "ar" ? faq.answerAr : faq.answerEn;

            return (
              <Card
                key={index}
                className="group overflow-hidden bg-gradient-to-br from-background to-muted/30 border-0 shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <CardContent className="p-0">
                  <Button
                    variant="ghost"
                    onClick={() => toggleItem(index)}
                    className="w-full p-6 text-left justify-between hover:bg-primary/5 transition-colors duration-300"
                  >
                    <span className="text-lg font-semibold text-foreground pr-4">
                      {question}
                    </span>
                    <ChevronDown
                      className={cn(
                        "h-5 w-5 text-primary transition-transform duration-300 flex-shrink-0",
                        isOpen ? "rotate-180" : ""
                      )}
                    />
                  </Button>

                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="px-6 pb-6 pt-0">
                      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent mb-4" />
                      <p className="text-muted-foreground leading-relaxed">
                        {answer}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4" />
            <span>{t("faqContactUs")}</span>
          </div>
        </div>
      </div>
    </section>
  );
}
