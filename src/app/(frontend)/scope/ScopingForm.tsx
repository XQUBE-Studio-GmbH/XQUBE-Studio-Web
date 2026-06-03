'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

// ─── Constants ────────────────────────────────────────────────────────────────

const ASSET_TYPES = [
  {
    id: 'Weapons',
    label: 'Weapons',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M14.5 3.5 L20.5 9.5 L9 21 L3 21 L3 15 Z" />
        <line x1="14.5" y1="9.5" x2="20.5" y2="3.5" />
        <line x1="6" y1="18" x2="9" y2="15" />
      </svg>
    ),
  },
  {
    id: 'Vehicles',
    label: 'Vehicles',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M5 17H3a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2h-2" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="15" cy="17" r="2" />
        <path d="M5 10V7a2 2 0 0 1 2-2h5l3 5" />
      </svg>
    ),
  },
  {
    id: 'Environments',
    label: 'Environments',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M3 20 L8 10 L12 16 L15 12 L21 20 Z" />
        <circle cx="18" cy="6" r="2" />
      </svg>
    ),
  },
  {
    id: 'Props',
    label: 'Props',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M21 16V8a2 2 0 0 0-1-1.73L13 2.27a2 2 0 0 0-2 0L4 6.27A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: 'VR Assets',
    label: 'VR Assets',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <path d="M2 9h20v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9Z" />
        <path d="M2 9V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2" />
        <circle cx="8.5" cy="14" r="2" />
        <circle cx="15.5" cy="14" r="2" />
      </svg>
    ),
  },
  {
    id: 'Fortnite / UEFN',
    label: 'Fortnite / UEFN',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="2" y="6" width="20" height="12" rx="2" />
        <circle cx="8" cy="12" r="2" />
        <circle cx="16" cy="12" r="1" />
        <line x1="19" y1="10" x2="19" y2="14" />
        <line x1="17" y1="12" x2="21" y2="12" />
      </svg>
    ),
  },
  {
    id: 'Roblox',
    label: 'Roblox',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-7 h-7">
        <rect x="3" y="3" width="8" height="8" rx="1" />
        <rect x="13" y="3" width="8" height="8" rx="1" />
        <rect x="3" y="13" width="8" height="8" rx="1" />
        <rect x="13" y="13" width="8" height="8" rx="1" />
      </svg>
    ),
  },
]

// All possible engine options in display order
const ALL_ENGINES = [
  'Unreal Engine 5',
  'Unity',
  'UEFN / Fortnite Creative',
  'Roblox Studio',
  'Meta Quest / PSVR2',
  'Engine Agnostic',
  'Not Sure Yet',
]

// Asset types that are platform-neutral (can target any engine)
const GENERAL_ASSET_TYPES = ['Weapons', 'Vehicles', 'Environments', 'Props']

// Returns the subset of engines relevant to the selected asset types.
// Rules:
//   General assets (Weapons/Vehicles/Environments/Props) → unlock ALL engines
//   VR Assets   → UE5 + Unity + Meta Quest/PSVR2 + Not Sure Yet
//   Fortnite    → UEFN/Fortnite Creative + Not Sure Yet
//   Roblox      → Roblox Studio + Not Sure Yet
//   Engine Agnostic appears only when at least one general asset type is selected
//   Not Sure Yet always appears
//   Union logic for mixed selections
function getFilteredEngines(assetTypes: string[]): string[] {
  if (assetTypes.length === 0) return ALL_ENGINES

  const hasGeneral  = assetTypes.some((t) => GENERAL_ASSET_TYPES.includes(t))
  const hasVR       = assetTypes.includes('VR Assets')
  const hasFortnite = assetTypes.includes('Fortnite / UEFN')
  const hasRoblox   = assetTypes.includes('Roblox')

  if (hasGeneral) return ALL_ENGINES   // general assets unlock everything

  const relevant = new Set<string>()
  if (hasVR) {
    relevant.add('Unreal Engine 5')
    relevant.add('Unity')
    relevant.add('Meta Quest / PSVR2')
  }
  if (hasFortnite) relevant.add('UEFN / Fortnite Creative')
  if (hasRoblox)   relevant.add('Roblox Studio')
  relevant.add('Not Sure Yet')         // always present

  return ALL_ENGINES.filter((e) => relevant.has(e))
}

// If only one real platform exists (excluding "Not Sure Yet"), return it for auto-selection.
function getAutoEngine(filtered: string[]): string {
  const real = filtered.filter((e) => e !== 'Not Sure Yet')
  return real.length === 1 ? real[0] : ''
}

const TIMELINES = [
  'Under 1 month',
  '1 – 3 months',
  '3 – 6 months',
  '6 months+',
  'Not Sure Yet',
]

const TOTAL_STEPS = 6

// ─── Types ────────────────────────────────────────────────────────────────────

interface FormData {
  assetTypes:         string[]
  quantities:         Record<string, number>
  engine:             string
  timeline:           string
  referenceGame:      string
  additionalContext:  string
  name:               string
  email:              string
  privacyConsent:     boolean
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function StepLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold tracking-widest uppercase text-xq-accent mb-2">
      {children}
    </p>
  )
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">{children}</h2>
  )
}

function StepSubtitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xq-muted text-sm mb-8">{children}</p>
  )
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null
  return <p className="mt-1.5 text-xs text-red-400">{message}</p>
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ScopingForm() {
  const router = useRouter()

  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState<FormData>({
    assetTypes:        [],
    quantities:        {},
    engine:            '',
    timeline:          '',
    referenceGame:     '',
    additionalContext: '',
    name:              '',
    email:             '',
    privacyConsent:    false,
  })
  const [errors,      setErrors]      = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError,  setSubmitError]  = useState('')

  // ── Validation per step ─────────────────────────────────────────────────────

  function validateStep(s: number): Record<string, string> {
    const errs: Record<string, string> = {}
    if (s === 1) {
      if (formData.assetTypes.length === 0)
        errs.assetTypes = 'Select at least one asset type to continue.'
    }
    if (s === 2) {
      formData.assetTypes.forEach((type) => {
        const qty = formData.quantities[type]
        if (!qty || qty < 1) errs[`qty_${type}`] = 'Enter a quantity of at least 1.'
        if (qty > 50)        errs[`qty_${type}`] = 'Maximum quantity is 50.'
      })
    }
    if (s === 3) {
      if (!formData.engine) errs.engine = 'Please select an engine or platform.'
    }
    if (s === 4) {
      if (!formData.timeline) errs.timeline = 'Please select a timeline.'
    }
    if (s === 6) {
      if (!formData.name.trim())  errs.name  = 'Full name is required.'
      if (!formData.email.trim()) errs.email = 'Email address is required.'
      if (formData.email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
        errs.email = 'Enter a valid email address.'
      if (!formData.privacyConsent) errs.privacy = 'Please agree to the Privacy Policy to continue.'
    }
    return errs
  }

  function handleNext() {
    const errs = validateStep(step)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})

    const nextStep = Math.min(step + 1, TOTAL_STEPS)

    // Auto-select engine when entering step 3 if exactly one real option exists
    if (nextStep === 3) {
      const filtered = getFilteredEngines(formData.assetTypes)
      const auto     = getAutoEngine(filtered)
      if (auto && formData.engine !== auto) {
        setFormData((p) => ({ ...p, engine: auto }))
      }
    }

    setStep(nextStep)
  }

  function handleBack() {
    setErrors({})
    setStep((s) => Math.max(s - 1, 1))
  }

  // ── Asset type toggle ───────────────────────────────────────────────────────

  function toggleAssetType(type: string) {
    setFormData((prev) => {
      const selected = prev.assetTypes.includes(type)
        ? prev.assetTypes.filter((t) => t !== type)
        : [...prev.assetTypes, type]

      // Initialise quantity to 1 if newly added
      const quantities = { ...prev.quantities }
      if (!selected.includes(type)) delete quantities[type]
      else if (!quantities[type])   quantities[type] = 1

      // Clear engine selection if it's no longer valid for the new asset type set
      const newFiltered = getFilteredEngines(selected)
      const engine = newFiltered.includes(prev.engine) ? prev.engine : ''

      return { ...prev, assetTypes: selected, quantities, engine }
    })
    setErrors((e) => { const n = { ...e }; delete n.assetTypes; return n })
  }

  // ── Quantity change ─────────────────────────────────────────────────────────

  function handleQuantityChange(type: string, raw: string) {
    const val = Math.max(1, Math.min(50, parseInt(raw, 10) || 1))
    setFormData((prev) => ({ ...prev, quantities: { ...prev.quantities, [type]: val } }))
    setErrors((e) => { const n = { ...e }; delete n[`qty_${type}`]; return n })
  }

  // ── Submit ──────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    const errs = validateStep(6)
    if (Object.keys(errs).length > 0) { setErrors(errs); return }

    setIsSubmitting(true)
    setSubmitError('')

    const payload = {
      assetTypes: formData.assetTypes.map((type) => ({
        assetType: type,
        quantity:  formData.quantities[type] ?? 1,
      })),
      engine:            formData.engine,
      timeline:          formData.timeline,
      referenceGame:     formData.referenceGame,
      additionalContext: formData.additionalContext,
      name:              formData.name,
      email:             formData.email,
    }

    try {
      const res = await fetch('/api/scope', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        setSubmitError(data.error || 'Something went wrong. Please try again.')
        setIsSubmitting(false)
        return
      }
      router.push('/scope/confirmed')
    } catch {
      setSubmitError('Network error. Please check your connection and try again.')
      setIsSubmitting(false)
    }
  }

  // ── Progress bar ────────────────────────────────────────────────────────────

  const progress = ((step - 1) / (TOTAL_STEPS - 1)) * 100

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-[calc(100vh-72px)] bg-xq-bg flex flex-col">
      {/* Progress bar */}
      <div className="bg-xq-card border-b border-xq-border">
        <div className="xq-container py-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-xq-muted tracking-wide">
              Step {step} of {TOTAL_STEPS}
            </span>
            <span className="text-xs text-xq-muted">
              {step < TOTAL_STEPS ? 'Almost there...' : 'Last step'}
            </span>
          </div>
          <div className="h-1 bg-xq-border rounded-full overflow-hidden">
            <div
              className="h-full bg-xq-accent rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.max(progress, 8)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Form body */}
      <div className="flex-1 xq-container py-12 md:py-20">
        <div className="max-w-2xl mx-auto">

          {/* ── Step 1: Asset Types ──────────────────────────────── */}
          {step === 1 && (
            <div>
              <StepLabel>Step 1</StepLabel>
              <StepTitle>What are you building?</StepTitle>
              <StepSubtitle>Select all asset types you need. You can pick more than one.</StepSubtitle>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 mb-2">
                {ASSET_TYPES.map(({ id, label, icon }) => {
                  const selected = formData.assetTypes.includes(id)
                  return (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleAssetType(id)}
                      className={`relative flex flex-col items-center gap-3 p-4 rounded-lg border text-center transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-xq-accent ${
                        selected
                          ? 'bg-[#0a1f14] border-xq-accent text-white'
                          : 'bg-xq-card border-xq-border text-xq-muted hover:border-xq-accent/50 hover:text-xq-light'
                      }`}
                    >
                      {/* Checkmark */}
                      <span
                        className={`absolute top-2 right-2 w-4 h-4 rounded-full border flex items-center justify-center transition-all duration-200 ${
                          selected
                            ? 'bg-xq-accent border-xq-accent'
                            : 'border-xq-border'
                        }`}
                      >
                        {selected && (
                          <svg viewBox="0 0 10 8" fill="none" className="w-2.5 h-2">
                            <path d="M1 4l2.5 2.5L9 1" stroke="#000" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </span>

                      <span className={`transition-colors ${selected ? 'text-xq-accent' : ''}`}>
                        {icon}
                      </span>
                      <span className="text-xs font-semibold leading-tight">{label}</span>
                    </button>
                  )
                })}
              </div>
              <FieldError message={errors.assetTypes} />
            </div>
          )}

          {/* ── Step 2: Quantities ───────────────────────────────── */}
          {step === 2 && (
            <div>
              <StepLabel>Step 2</StepLabel>
              <StepTitle>How many of each?</StepTitle>
              <StepSubtitle>Enter the approximate quantity for each asset type.</StepSubtitle>

              <div className="space-y-4">
                {formData.assetTypes.map((type) => (
                  <div key={type}>
                    <label className="block text-sm font-semibold text-xq-light mb-1.5">
                      {type}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      placeholder="e.g. 5"
                      value={formData.quantities[type] ?? ''}
                      onChange={(e) => handleQuantityChange(type, e.target.value)}
                      className={`xq-input ${errors[`qty_${type}`] ? 'border-red-500' : ''}`}
                    />
                    <p className="text-xs text-xq-muted mt-1">
                      For larger volumes, add detail in the context field. Min 1 · Max 50.
                    </p>
                    <FieldError message={errors[`qty_${type}`]} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Step 3: Engine / Platform ────────────────────────── */}
          {step === 3 && (
            <div>
              <StepLabel>Step 3</StepLabel>
              <StepTitle>Which engine or platform?</StepTitle>
              <StepSubtitle>This helps us deliver assets in the right format and quality tier.</StepSubtitle>

              <div className="space-y-2">
                {getFilteredEngines(formData.assetTypes).map((eng) => {
                  const selected = formData.engine === eng
                  return (
                    <button
                      key={eng}
                      type="button"
                      onClick={() => {
                        setFormData((p) => ({ ...p, engine: eng }))
                        setErrors((e) => { const n = { ...e }; delete n.engine; return n })
                      }}
                      className={`w-full flex items-center justify-between px-5 py-4 rounded-lg border text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-xq-accent ${
                        selected
                          ? 'bg-[#0a1f14] border-xq-accent text-white'
                          : 'bg-xq-card border-xq-border text-xq-muted hover:border-xq-accent/50 hover:text-xq-light'
                      }`}
                    >
                      <span className="font-semibold text-sm">{eng}</span>
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          selected ? 'border-xq-accent bg-xq-accent' : 'border-xq-border'
                        }`}
                      >
                        {selected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </span>
                    </button>
                  )
                })}
              </div>
              <FieldError message={errors.engine} />
            </div>
          )}

          {/* ── Step 4: Timeline ─────────────────────────────────── */}
          {step === 4 && (
            <div>
              <StepLabel>Step 4</StepLabel>
              <StepTitle>What's your timeline?</StepTitle>
              <StepSubtitle>We'll use this to scope a realistic delivery plan for your project.</StepSubtitle>

              <div className="space-y-2">
                {TIMELINES.map((tl) => {
                  const selected = formData.timeline === tl
                  return (
                    <button
                      key={tl}
                      type="button"
                      onClick={() => {
                        setFormData((p) => ({ ...p, timeline: tl }))
                        setErrors((e) => { const n = { ...e }; delete n.timeline; return n })
                      }}
                      className={`w-full flex items-center justify-between px-5 py-4 rounded-lg border text-left transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-xq-accent ${
                        selected
                          ? 'bg-[#0a1f14] border-xq-accent text-white'
                          : 'bg-xq-card border-xq-border text-xq-muted hover:border-xq-accent/50 hover:text-xq-light'
                      }`}
                    >
                      <span className="font-semibold text-sm">{tl}</span>
                      <span
                        className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 transition-all ${
                          selected ? 'border-xq-accent bg-xq-accent' : 'border-xq-border'
                        }`}
                      >
                        {selected && <span className="w-1.5 h-1.5 rounded-full bg-black" />}
                      </span>
                    </button>
                  )
                })}
              </div>
              <FieldError message={errors.timeline} />
            </div>
          )}

          {/* ── Step 5: References + Context ─────────────────────── */}
          {step === 5 && (
            <div>
              <StepLabel>Step 5</StepLabel>
              <StepTitle>Art direction & context</StepTitle>
              <StepSubtitle>Optional — the more you share, the faster we can move.</StepSubtitle>

              <div className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-xq-light mb-1.5">
                    What game's art style are you targeting?
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Escape from Tarkov, Fortnite, Genshin Impact..."
                    value={formData.referenceGame}
                    onChange={(e) => setFormData((p) => ({ ...p, referenceGame: e.target.value }))}
                    className="xq-input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-xq-light mb-1.5">
                    Anything else we should know?
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Art direction notes, existing assets to match, file format requirements, NDA needed..."
                    value={formData.additionalContext}
                    onChange={(e) => setFormData((p) => ({ ...p, additionalContext: e.target.value }))}
                    className="xq-input resize-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 6: Name + Email ──────────────────────────────── */}
          {step === 6 && (
            <div>
              <StepLabel>Step 6</StepLabel>
              <StepTitle>Almost done — who should we contact?</StepTitle>
              <StepSubtitle>We'll send your brief summary and next steps to this email.</StepSubtitle>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-xq-light mb-1.5">
                    Full name <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, name: e.target.value }))
                      setErrors((e2) => { const n = { ...e2 }; delete n.name; return n })
                    }}
                    className={`xq-input ${errors.name ? 'border-red-500' : ''}`}
                  />
                  <FieldError message={errors.name} />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-xq-light mb-1.5">
                    Email address <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    placeholder="you@studio.com"
                    value={formData.email}
                    onChange={(e) => {
                      setFormData((p) => ({ ...p, email: e.target.value }))
                      setErrors((e2) => { const n = { ...e2 }; delete n.email; return n })
                    }}
                    className={`xq-input ${errors.email ? 'border-red-500' : ''}`}
                  />
                  <FieldError message={errors.email} />
                </div>

                {/* Privacy checkbox */}
                <div>
                  <label
                    className={`flex items-start gap-3 cursor-pointer group ${errors.privacy ? 'text-red-400' : ''}`}
                  >
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={formData.privacyConsent}
                      onClick={() => {
                        setFormData((p) => ({ ...p, privacyConsent: !p.privacyConsent }))
                        setErrors((e) => { const n = { ...e }; delete n.privacy; return n })
                      }}
                      className={`mt-0.5 w-5 h-5 shrink-0 rounded border-2 flex items-center justify-center transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-xq-accent ${
                        formData.privacyConsent
                          ? 'bg-xq-accent border-xq-accent'
                          : errors.privacy
                            ? 'border-red-500'
                            : 'border-xq-border group-hover:border-xq-accent/60'
                      }`}
                    >
                      {formData.privacyConsent && (
                        <svg viewBox="0 0 10 8" fill="none" className="w-3 h-2.5">
                          <path d="M1 4l2.5 2.5L9 1" stroke="#000" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </button>
                    <span className="text-sm text-xq-muted leading-relaxed">
                      I agree to XQube Studio&apos;s{' '}
                      <Link href="/privacy" target="_blank" className="text-xq-accent hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                  <FieldError message={errors.privacy} />
                </div>
              </div>

              {submitError && (
                <div className="mt-5 p-4 rounded-lg border border-red-500/30 bg-red-950/20">
                  <p className="text-sm text-red-400">{submitError}</p>
                </div>
              )}
            </div>
          )}

          {/* ── Navigation buttons ────────────────────────────────── */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-xq-border">
            {step > 1 ? (
              <button
                type="button"
                onClick={handleBack}
                className="xq-btn-ghost text-sm"
              >
                ← Back
              </button>
            ) : (
              <div />
            )}

            {step < TOTAL_STEPS ? (
              <button
                type="button"
                onClick={handleNext}
                className="xq-btn-primary text-sm"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="xq-btn-primary text-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Sending...' : 'Share Brief'}
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  )
}
