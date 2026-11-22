"use client";
import { ImageUpload } from "@/components/admin/image-upload";
import type { FooterConfig, FooterLink } from "@/lib/footer-config";

interface Props { value: FooterConfig; onChange: (value: FooterConfig) => void }
const fieldClass = "w-full px-4 py-3 bg-background border border-border rounded-xl";
export function FooterEditor({ value, onChange }: Props) {
  const update = (patch: Partial<FooterConfig>) => onChange({ ...value, ...patch });
  const updateLink = (group: "navigation" | "more", index: number, patch: Partial<FooterLink>) => {
    update({ [group]: value[group].map((link, i) => i === index ? { ...link, ...patch } : link) });
  };
  return <div className="grid gap-4">
    <ImageUpload value={value.image} onChange={image => update({ image })} folder="footer" label="تصویر پس‌زمینه فوتر" />
    {([
      ["title", "عنوان فوتر"], ["buttonText", "متن دکمه"], ["buttonHref", "پیوند دکمه"],
      ["credit", "متن معرفی یا اعتبار (خالی: نام پروفایل)"], ["navigationTitle", "عنوان ستون دسترسی سریع"],
      ["moreTitle", "عنوان ستون دوم"], ["socialsTitle", "عنوان شبکه‌های اجتماعی"],
    ] as const).map(([key, label]) => <label key={key} className="block text-sm font-medium">{label}
      <input className={`${fieldClass} mt-2`} value={value[key]} onChange={e => update({ [key]: e.target.value })} />
    </label>)}
    {([ ["navigation", "پیوندهای ستون دسترسی سریع"], ["more", "پیوندهای ستون دوم"] ] as const).map(([group, label]) => <fieldset key={group} className="grid gap-3 rounded-xl border border-border p-4">
      <legend className="px-1 text-sm font-medium">{label}</legend>
      {value[group].map((link, index) => <div key={index} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
        <input aria-label={`عنوان پیوند ${index + 1} ${label}`} className={fieldClass} placeholder="عنوان پیوند" value={link.label} onChange={e => updateLink(group, index, { label: e.target.value })} />
        <input aria-label={`نشانی پیوند ${index + 1} ${label}`} className={fieldClass} dir="ltr" placeholder="/contact" value={link.href} onChange={e => updateLink(group, index, { href: e.target.value })} />
        <button type="button" className="rounded-xl border border-border px-4 py-2 text-sm" onClick={() => update({ [group]: value[group].filter((_, i) => i !== index) })}>حذف</button>
      </div>)}
      <button type="button" className="justify-self-start rounded-xl border border-border px-4 py-2 text-sm" onClick={() => update({ [group]: [...value[group], { label: "", href: "" }] })}>افزودن پیوند</button>
    </fieldset>)}
    <p className="text-sm text-muted-foreground">لوگو و نام سایت در تنظیمات همین صفحه و شبکه‌های اجتماعی در بخش شبکه‌های اجتماعی مدیریت می‌شوند.</p>
  </div>;
}
