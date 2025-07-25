# Dynamic Translation System

This system provides **real-time translation** of any English content to Kannada using the LibreTranslate API. No need for pre-translated database content!

## 🚀 How It Works

### 1. **Dynamic Translation Hook** (`useDynamicTranslation`)

```typescript
const { dtSync, translateText, isTranslating } = useDynamicTranslation();

// Translate any text
const translatedText = await translateText("What is your name?", "kn");

// Get cached translation (synchronous)
const cachedText = dtSync("Hello World");
```

### 2. **Automatic Translation Components**

#### **TranslatedText Component**
Automatically translates any text content:

```tsx
// English: "What is your name?"
// Kannada: "ನಿಮ್ಮ ಹೆಸರೇನು?"
<TranslatedText>What is your name?</TranslatedText>
```

#### **TranslatedLabel Component**
For form labels with optional required indicator:

```tsx
// English: "Full Name *"
// Kannada: "ಪೂರ್ಣ ಹೆಸರು *"
<TranslatedLabel text="Full Name" required />
```

#### **TranslatedOption Component**
For select dropdown options:

```tsx
<select>
  <TranslatedOption value="male">Male</TranslatedOption>
  <TranslatedOption value="female">Female</TranslatedOption>
</select>
```

## 🎯 Implementation Examples

### **Form Fields**
```tsx
<FormGroup>
  <TranslatedLabel text="Age" required />
  <input 
    type="number" 
    placeholder={dtSync('Enter your age')}
  />
</FormGroup>
```

### **Radio Buttons**
```tsx
<RadioItem>
  <input type="radio" value="yes" />
  <TranslatedText>Yes</TranslatedText>
</RadioItem>
```

### **Select Dropdowns**
```tsx
<select>
  <TranslatedOption value="">Select education level</TranslatedOption>
  <TranslatedOption value="primary">Primary Education</TranslatedOption>
  <TranslatedOption value="secondary">Secondary Education</TranslatedOption>
</select>
```

## 🔧 Key Features

### **1. Smart Caching**
- Translations are cached to avoid repeated API calls
- Instant display for previously translated content
- Reduces API usage and improves performance

### **2. Automatic Language Detection**
- Detects current language from TranslationContext
- Only translates when language is not English
- Seamless integration with existing language toggle

### **3. Fallback Strategy**
- If LibreTranslate API fails, shows original English text
- Graceful error handling
- No broken UI experience

### **4. Real-time Translation**
- Translates content as language changes
- No page refresh required
- Smooth user experience

## 🌟 Benefits for Your Use Case

### **✅ Database Simplicity**
- Store only English content in database
- No need for bilingual database schema
- Easier content management

### **✅ Scalability**
- Add new languages easily
- No database migrations needed
- Works with any content from any API

### **✅ Real-time Updates**
- Content translates immediately when language changes
- No pre-translation required
- Dynamic content from database works perfectly

### **✅ Cost Effective**
- Only translates when needed
- Caches results to minimize API calls
- Free LibreTranslate API usage

## 📋 Usage in Your Questionnaire

Replace your current approach:

```tsx
// ❌ Old way (requires pre-translated content)
<Label>{t('What is your age?')}</Label>

// ✅ New way (dynamic translation)
<TranslatedLabel text="What is your age?" />
```

For database-driven questionnaires:

```tsx
// Your API returns only English content
const questions = await fetch('/api/questionnaires/123');
// questions = [{ text: "What is your age?", type: "text" }]

// Component automatically translates
{questions.map(question => (
  <FormGroup key={question.id}>
    <TranslatedLabel text={question.text} />
    {/* input field */}
  </FormGroup>
))}
```

## 🎮 Demo

Visit `/translation-demo` to see the system in action:
- Live translation of form fields
- Radio buttons, dropdowns, labels
- Toggle language switch to see real-time translation

## 🔄 Migration Path

1. **Replace hardcoded translations**: Convert `{t('text')}` to `<TranslatedText>text</TranslatedText>`
2. **Update form labels**: Use `<TranslatedLabel text="..." />`
3. **Update select options**: Use `<TranslatedOption>...</TranslatedOption>`
4. **Use dtSync for placeholders**: `placeholder={dtSync('Enter text')}`

## 🚀 Production Ready

- ✅ Error handling and fallbacks
- ✅ Performance optimized with caching
- ✅ Works with any content source
- ✅ Scales to multiple languages
- ✅ No database changes required

This solution perfectly addresses your concern about dynamic translation without requiring bilingual database content!
