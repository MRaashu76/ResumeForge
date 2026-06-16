import React, { useState, useRef, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { Download, Eye, EyeOff, ChevronLeft, ChevronRight, RotateCcw, Check, Zap, Loader2, ArrowLeft, ZoomIn, ZoomOut } from 'lucide-react'
import { useResumeData } from '../hooks/useResumeData'
import { exportToPDF } from '../utils/pdfExport'
import ResumePreview from '../components/preview/ResumePreview'
import ATSScorePanel from '../components/builder/ATSScorePanel'
import ResumeStrengthPanel from '../components/builder/ResumeStrengthPanel'
import PersonalInfoStep from '../components/builder/PersonalInfoStep'
import SummaryStep from '../components/builder/SummaryStep'
import EducationStep from '../components/builder/EducationStep'
import ExperienceStep from '../components/builder/ExperienceStep'
import ProjectsStep from '../components/builder/ProjectsStep'
import SkillsStep from '../components/builder/SkillsStep'
import CertificationsStep from '../components/builder/CertificationsStep'
import TemplateStep from '../components/builder/TemplateStep'
import ThemeToggle from '../components/ui/ThemeToggle'

const STEPS = [
  { id: 1, label: 'Personal', shortLabel: 'Info' },
  { id: 2, label: 'Summary', shortLabel: 'Summary' },
  { id: 3, label: 'Education', shortLabel: 'Education' },
  { id: 4, label: 'Experience', shortLabel: 'Experience' },
  { id: 5, label: 'Projects', shortLabel: 'Projects' },
  { id: 6, label: 'Skills', shortLabel: 'Skills' },
  { id: 7, label: 'Certifications', shortLabel: 'Certs' },
  { id: 8, label: 'Template', shortLabel: 'Template' },
]

export default function BuilderPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [showPreview, setShowPreview] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [zoom, setZoom] = useState(0.55)
  const {
    resumeData,
    lastSaved,
    updatePersonal,
    updateSummary,
    updateTemplate,
    addEducation, updateEducation, deleteEducation,
    addExperience, updateExperience, deleteExperience,
    addProject, updateProject, deleteProject,
    addSkill, removeSkill,
    addCertification, updateCertification, deleteCertification,
    clearResume,
  } = useResumeData()

  const handleExport = async () => {
    setExporting(true)
    const name = resumeData.personal?.fullName?.replace(/\s+/g, '_') || 'Resume'
    const success = await exportToPDF('resume-export', `${name}_Resume.pdf`)
    setExporting(false)
    if (success) {
      setExportSuccess(true)
      setTimeout(() => setExportSuccess(false), 2500)
    }
  }

  const handleClear = () => {
    if (window.confirm('Clear all resume data and start fresh?')) {
      clearResume()
      setCurrentStep(1)
    }
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1: return <PersonalInfoStep data={resumeData.personal} onChange={updatePersonal} />
      case 2: return <SummaryStep data={resumeData.summary} onChange={updateSummary} />
      case 3: return <EducationStep data={resumeData.education} onAdd={addEducation} onUpdate={updateEducation} onDelete={deleteEducation} />
      case 4: return <ExperienceStep data={resumeData.experience} onAdd={addExperience} onUpdate={updateExperience} onDelete={deleteExperience} />
      case 5: return <ProjectsStep data={resumeData.projects} onAdd={addProject} onUpdate={updateProject} onDelete={deleteProject} />
      case 6: return <SkillsStep data={resumeData.skills} onAdd={addSkill} onRemove={removeSkill} />
      case 7: return <CertificationsStep data={resumeData.certifications} onAdd={addCertification} onUpdate={updateCertification} onDelete={deleteCertification} />
      case 8: return <TemplateStep selected={resumeData.template} onSelect={updateTemplate} />
      default: return null
    }
  }

  const progressPct = ((currentStep - 1) / (STEPS.length - 1)) * 100

  return (
    <>
      <div className="h-screen flex flex-col bg-background overflow-hidden relative z-0">
      {/* Top bar */}
      <header className="flex-shrink-0 h-14 bg-surface border-b border-border flex items-center px-4 gap-3 z-10">
        <Link to="/" className="flex items-center gap-1.5 text-text-secondary hover:text-foreground transition-colors mr-1">
          <ArrowLeft size={16} />
          <span className="text-sm hidden sm:inline">Back</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="font-bold text-foreground text-sm hidden sm:inline">ResumeForge</span>
        </div>

        <div className="flex-1 mx-2 hidden md:block">
          <div className="max-w-xs">
            <div className="flex justify-between text-xs text-text-secondary mb-1">
              <span>Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].label}</span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div className="h-1.5 bg-background rounded-full overflow-hidden">
              <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 ml-auto">
          <ThemeToggle />
          {lastSaved && (
            <span className="text-xs text-text-secondary hidden lg:flex items-center gap-1">
              <Check size={11} className="text-success" /> Saved
            </span>
          )}

          <button
            onClick={() => setShowPreview(p => !p)}
            className="flex items-center gap-1.5 text-xs font-medium text-text-secondary hover:text-foreground border border-border px-3 py-1.5 rounded-lg hover:bg-card transition-all md:hidden"
          >
            {showPreview ? <EyeOff size={13} /> : <Eye size={13} />}
            {showPreview ? 'Editor' : 'Preview'}
          </button>

          <button
            onClick={handleClear}
            className="text-xs font-medium text-text-secondary hover:text-red-500 border border-border px-3 py-1.5 rounded-lg hover:bg-red-900/20 transition-all flex items-center gap-1.5 hidden sm:flex"
          >
            <RotateCcw size={12} />
            <span className="hidden lg:inline">Clear</span>
          </button>

          <button
            onClick={handleExport}
            disabled={exporting}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
              exportSuccess
                ? 'bg-success text-white'
                : 'bg-primary text-white hover:bg-primary-hover shadow-[0_0_15px_rgba(249,115,22,0.3)]'
            } disabled:opacity-70`}
          >
            {exporting ? (
              <Loader2 size={14} className="animate-spin" />
            ) : exportSuccess ? (
              <Check size={14} />
            ) : (
              <Download size={14} />
            )}
            <span className="hidden sm:inline">{exportSuccess ? 'Saved!' : 'Export PDF'}</span>
          </button>
        </div>
      </header>

      {/* Main layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Editor panel */}
        <div className={`${showPreview ? 'hidden' : 'flex'} md:flex flex-col w-full md:w-[38%] lg:w-[35%] border-r border-border bg-surface overflow-y-auto`}>
          {/* Step tabs */}
          <div className="flex-shrink-0 px-4 pt-4">
            {/* Mobile step selector */}
            <div className="flex items-center justify-between mb-4 md:hidden">
              <span className="text-sm font-semibold text-foreground">Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].label}</span>
              <div className="h-1.5 flex-1 mx-3 bg-background rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full transition-all" style={{ width: `${progressPct}%` }} />
              </div>
            </div>

            {/* Step pills - desktop */}
            <div className="hidden md:flex flex-wrap gap-1 mb-4">
              {STEPS.map((step) => (
                <button
                  key={step.id}
                  onClick={() => setCurrentStep(step.id)}
                  className={`text-xs px-2.5 py-1 rounded-lg font-medium transition-all ${
                    currentStep === step.id
                      ? 'bg-primary text-white shadow-[0_0_15px_rgba(249,115,22,0.3)]'
                      : 'text-text-secondary hover:text-foreground hover:bg-background'
                  }`}
                >
                  {step.shortLabel}
                </button>
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="flex-1 px-4 pb-4">
            <div className="mb-4">
              <h2 className="text-base font-bold text-foreground">{STEPS[currentStep - 1].label}</h2>
            </div>
            {renderStep()}
          </div>

          {/* Navigation */}
          <div className="flex-shrink-0 border-t border-border p-4 flex justify-between gap-3">
            <button
              onClick={() => setCurrentStep(s => Math.max(1, s - 1))}
              disabled={currentStep === 1}
              className="flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed transition-colors px-4 py-2 rounded-xl hover:bg-card"
            >
              <ChevronLeft size={15} /> Previous
            </button>
            {currentStep < STEPS.length ? (
              <button
                onClick={() => setCurrentStep(s => Math.min(STEPS.length, s + 1))}
                className="flex items-center gap-1.5 text-sm font-semibold text-foreground bg-primary px-5 py-2 rounded-xl hover:bg-primary-hover transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)]"
              >
                Next <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={handleExport}
                disabled={exporting}
                className="flex items-center gap-1.5 text-sm font-semibold text-foreground bg-success px-5 py-2 rounded-xl hover:bg-green-600 transition-all shadow-md"
              >
                <Download size={15} /> Export PDF
              </button>
            )}
          </div>
        </div>

        {/* Preview panel */}
        <div className={`${showPreview ? 'flex' : 'hidden'} md:flex flex-col flex-1 overflow-hidden bg-background`}>
          {/* Preview toolbar */}
          <div className="flex-shrink-0 h-10 bg-surface border-b border-border flex items-center px-4 gap-3">
            <Eye size={13} className="text-text-secondary" />
            <span className="text-xs font-medium text-text-secondary">Live Preview</span>
            <div className="flex-1" />

            {/* Sidebar panels */}
            <div className="hidden lg:flex items-center gap-3 text-xs text-text-secondary mr-2">
              <span>ATS & Strength panels on left</span>
            </div>

            {/* Zoom controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={() => setZoom(z => Math.max(0.3, z - 0.05))}
                className="p-1 hover:bg-card rounded transition-colors text-text-secondary"
              >
                <ZoomOut size={13} />
              </button>
              <span className="text-xs text-text-secondary w-10 text-center">{Math.round(zoom * 100)}%</span>
              <button
                onClick={() => setZoom(z => Math.min(1, z + 0.05))}
                className="p-1 hover:bg-card rounded transition-colors text-text-secondary"
              >
                <ZoomIn size={13} />
              </button>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Score panels */}
            <div className="hidden xl:flex flex-col w-56 flex-shrink-0 border-r border-border bg-surface overflow-y-auto">
              <div className="p-4 border-b border-border">
                <ATSScorePanel data={resumeData} />
              </div>
              <div className="p-4">
                <ResumeStrengthPanel data={resumeData} />
              </div>
            </div>

            {/* Resume canvas */}
            <div className="flex-1 overflow-auto p-6 flex justify-center">
              <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
                <ResumePreview data={resumeData} id="resume-preview" />
              </div>
            </div>
          </div>
        </div>
      </div>

      </div>
      
      {/* Hidden full-size export element, outside overflow bounds */}
      <div className="fixed top-0 left-0 -z-10 pointer-events-none" style={{ width: '794px' }}>
        <ResumePreview data={resumeData} id="resume-export" />
      </div>
    </>
  )
}
