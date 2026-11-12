---
title: "Sheaf for Business: PDF Tools for Legal, Finance & IT"
description: "Bates numbering, watermarks, hidden-data removal and court-ready PDFs that never leave the Mac. Deploy with Apple Business Manager and configure with any MDM."
url: https://sheafai.app/business
---

# Sheaf for Business

The PDF work legal, finance and HR teams do every day, right where they drag the file. Nothing is uploaded, so there is nothing to approve with your security team except the app.

## What your team gets

**Bates numbering**One sequence across every PDF in a production, like ACME000001. Continues from your last production with the same prefix.

**Page numbers, headers and footers**“Page 1 of 9”, file name, date, in any corner. Skip the cover page. Text and links keep working.

**Watermarks**Confidential, Draft or your own words, drawn into every page so they print and can’t be clicked away.

**Remove hidden data**Shows and removes author and edit history, comments, attached files, scripts and hidden layers. Pages look the same.

**Court-ready PDF**Flattens, removes hidden data, makes scans searchable and keeps each file under the e-filing limit, in parts if needed.

**Real redaction**Finds names, emails, phone, card, account and ID numbers, and deletes the text underneath.

**Fill and lock forms**Type into a PDF form, then save a copy with the answers locked into the page.

**PDF to Excel**Bank statements become a spreadsheet with every row checked against the running balance. Other tables become one sheet each.

**Unlock client statements**Opens password-protected statements, payslips and tax forms using client details kept in the Mac’s keychain.

**Certified true copies**Signature, name, membership number and date in one stamp, in each country’s wording. UDIN for Indian CAs.

**Upload size presets**Fit 10 MB for IRS and USCIS, 5 MB for India’s Income Tax and GST portals or Australia’s ATO and myGov.

**Shortcuts and folder automations**Every action works in Shortcuts, and a watched folder can number, clean or prepare files on its own.

## By team

**[Law firms](https://sheafai.app/pdf-software-for-law-firms-mac)**Bates numbering, redaction, metadata removal, court-ready PDFs.

**[Accounting & finance](https://sheafai.app/pdf-software-for-accountants-mac)**Statements to Excel, unlocking client PDFs, certified copies, portal sizes.

**[HR & payroll](https://sheafai.app/pdf-tools-for-hr-payroll-mac)**Protect payslips, redact ID numbers, fill and sign forms.

**[Real estate](https://sheafai.app/pdf-tools-for-real-estate-mac)**Sign, merge disclosure packs, photos to PDF, email size.

**[Healthcare offices](https://sheafai.app/pdf-tools-for-healthcare-office-mac)**Redact patient identifiers, searchable scans, protected files.

## Why security teams say yes

- **Files never leave the Mac.** Every action runs on the device. Sheaf has no servers, no account and no analytics.
- **Sandboxed by Apple.** Sheaf ships only through the Mac App Store, signed and reviewed by Apple, and can open only the files a person drops or picks.
- **Originals are never changed.** Every result is a new file, with Undo.
- **One network use, and it’s optional.** When converting a web page file (HTML) to PDF, macOS may load the images that page links to. No other action touches the network.

## Buying for a team

Buy **Sheaf for Business** in Apple Business Manager (or Apple School Manager) with volume purchasing, then assign it to Macs or people from your MDM. Everything is included, there is nothing to unlock and no trial reminders, so it’s ready on first launch.

Individuals can keep using the regular Sheaf with its free trial and one-time purchase.

## Managed settings

Send a configuration profile with the payload type com.vikashsingh.sheaf.business (or com.vikashsingh.sheaf for the regular app) from Jamf, Kandji, Intune, Mosyle or any MDM. A setting you set is locked in Sheaf’s Settings, and Settings shows “Managed by” your organization.

| Key | Type | What it does |
| --- | --- | --- |
| OrganizationName | String | Shown in Settings as “Managed by …”. |
| HiddenActions | Array of strings | Actions to remove, e.g. protect, sign. IDs: merge, compress, split, rotate, searchable, organize, sign, redact, protect, makePDF, toPDF, export, convertImage, resizeImage, number, watermark, clean, filing, fillForm, excel, unlock, certify. |
| outputMode | String | beside (next to the original) or folder. |
| outputFolderPath | String | Folder for results when outputMode is folder. |
| stripMetadata | Boolean | Remove author and document info from every result. |
| defaultCompression | String | high, balanced or small. |
| emailLimitMB | Integer | Size for “split into email-sized parts”. Default 25. |
| FilingLimitMB | Integer | Size limit for Court-ready PDFs. Default 35. |
| PortalLimitKB | Integer | Size for Compress › Fit upload presets, in KB. Default follows the country: 10000 in the US, 5000 elsewhere. |
| Country | String | Two-letter code (US, GB, IN, AU, CA, NZ, SG, ZA, AE) for certification wording, ID labels and upload size. Default: the Mac’s region. |
| DefaultWatermarkText | String | Words for the one-tap watermark, e.g. Privileged & Confidential. |
| BatesPrefix | String | Default Bates prefix, e.g. your matter code. |
| DisableReviewPrompts | Boolean | Never ask for an App Store rating. |
| DisableWatchedFolders | Boolean | Turn off folder automations. |

[Download a sample configuration profile](https://sheafai.app/sheaf-managed.mobileconfig) and edit the values before you upload it to your MDM.

## Requirements

macOS 14 Sonoma or later, Apple silicon or Intel. English, German, French, Spanish, Japanese and Indonesian.

Questions about a rollout? [Email us](mailto:singh.vikash2310@gmail.com).

## Questions

### Does Sheaf send any document data anywhere?

No. Every action runs on the Mac. Sheaf has no servers and collects no data.

### Why is there a separate business app?

Apple’s volume purchasing doesn’t support in-app purchases, so the regular Sheaf can’t be unlocked for a whole team. Sheaf for Business is paid once per Mac with everything included.

### Is the Bates sequence shared between people?

Each Mac remembers its own next number per prefix. For a shared production, give each person their own prefix or set the start number when numbering.

### Does removing hidden data change how pages look?

No. Pages look the same; author info, edit history, comments, attachments, scripts and hidden layers are removed.
