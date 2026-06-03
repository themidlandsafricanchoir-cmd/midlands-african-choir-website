import { useState } from 'react';

interface FormState {
  fullName: string;
  email: string;
  phone: string;
  voicePart: string;
  experience: string;
  hearAboutUs: string;
}

interface FormErrors {
  fullName?: string;
  email?: string;
  voicePart?: string;
  hearAboutUs?: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const INITIAL_FORM: FormState = {
  fullName: '',
  email: '',
  phone: '',
  voicePart: '',
  experience: '',
  hearAboutUs: '',
};

const EMAIL_PATTERN = /[^@]+@[^@]+\.[^@]+/;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};

  if (!form.fullName.trim()) {
    errors.fullName = 'Full name is required.';
  }

  if (!form.email.trim()) {
    errors.email = 'Email address is required.';
  } else if (!EMAIL_PATTERN.test(form.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!form.voicePart) {
    errors.voicePart = 'Please select your voice part.';
  }

  if (!form.hearAboutUs) {
    errors.hearAboutUs = 'Please tell us how you heard about us.';
  }

  return errors;
}

export default function JoinForm() {
  const [form, setForm] = useState<FormState>(INITIAL_FORM);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitStatus, setSubmitStatus] = useState<SubmitStatus>('idle');
  const [submitError, setSubmitError] = useState<string>('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setSubmitStatus('submitting');
    setSubmitError('');

    try {
      const response = await fetch(import.meta.env.PUBLIC_API_GATEWAY_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.fullName,
          email: form.email,
          phone: form.phone,
          voicePart: form.voicePart,
          experience: form.experience,
          hearAboutUs: form.hearAboutUs,
          message: `Expression of interest from ${form.fullName}`,
        }),
      });

      if (response.ok) {
        setSubmitStatus('success');
      } else {
        setSubmitStatus('error');
        setSubmitError(
          'Something went wrong submitting your form. Please try again or contact us directly.'
        );
      }
    } catch {
      setSubmitStatus('error');
      setSubmitError(
        'A network error occurred. Please check your connection and try again.'
      );
    }
  }

  if (submitStatus === 'success') {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-md bg-forest/10 border border-forest p-6 text-navy text-center"
      >
        <p className="text-lg font-semibold">
          Thank you! We&apos;ve received your expression of interest and will be in touch soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate aria-label="Join the Choir expression of interest form">
      {/* Submission error */}
      {submitStatus === 'error' && submitError && (
        <div
          role="alert"
          aria-live="assertive"
          className="mb-6 rounded-md border border-red-600 bg-red-50 px-4 py-3 text-red-600 text-sm"
        >
          {submitError}
        </div>
      )}

      {/* Full Name */}
      <div className="mb-5">
        <label htmlFor="fullName" className="block text-navy font-semibold mb-1">
          Full Name <span aria-hidden="true">*</span>
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
          maxLength={100}
          required
          aria-required="true"
          aria-describedby={errors.fullName ? 'fullName-error' : undefined}
          aria-invalid={errors.fullName ? 'true' : undefined}
          className="border border-navy/30 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-terracotta"
        />
        {errors.fullName && (
          <p id="fullName-error" role="alert" className="text-red-600 text-sm mt-1">
            {errors.fullName}
          </p>
        )}
      </div>

      {/* Email Address */}
      <div className="mb-5">
        <label htmlFor="email" className="block text-navy font-semibold mb-1">
          Email Address <span aria-hidden="true">*</span>
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
          aria-required="true"
          aria-describedby={errors.email ? 'email-error' : undefined}
          aria-invalid={errors.email ? 'true' : undefined}
          className="border border-navy/30 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-terracotta"
        />
        {errors.email && (
          <p id="email-error" role="alert" className="text-red-600 text-sm mt-1">
            {errors.email}
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div className="mb-5">
        <label htmlFor="phone" className="block text-navy font-semibold mb-1">
          Phone Number <span className="font-normal text-navy/60">(optional)</span>
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="border border-navy/30 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-terracotta"
        />
      </div>

      {/* Voice Part */}
      <div className="mb-5">
        <label htmlFor="voicePart" className="block text-navy font-semibold mb-1">
          Voice Part <span aria-hidden="true">*</span>
        </label>
        <select
          id="voicePart"
          name="voicePart"
          value={form.voicePart}
          onChange={handleChange}
          required
          aria-required="true"
          aria-describedby={errors.voicePart ? 'voicePart-error' : undefined}
          aria-invalid={errors.voicePart ? 'true' : undefined}
          className="border border-navy/30 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-terracotta bg-white"
        >
          <option value="">Select your voice part</option>
          <option value="Soprano">Soprano</option>
          <option value="Alto">Alto</option>
          <option value="Tenor">Tenor</option>
          <option value="Bass">Bass</option>
          <option value="Unsure">Unsure</option>
        </select>
        {errors.voicePart && (
          <p id="voicePart-error" role="alert" className="text-red-600 text-sm mt-1">
            {errors.voicePart}
          </p>
        )}
      </div>

      {/* Previous Choir Experience */}
      <div className="mb-5">
        <label htmlFor="experience" className="block text-navy font-semibold mb-1">
          Previous Choir Experience{' '}
          <span className="font-normal text-navy/60">(optional)</span>
        </label>
        <textarea
          id="experience"
          name="experience"
          value={form.experience}
          onChange={handleChange}
          maxLength={500}
          rows={4}
          className="border border-navy/30 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-terracotta resize-y"
        />
      </div>

      {/* How Did You Hear About Us */}
      <div className="mb-6">
        <label htmlFor="hearAboutUs" className="block text-navy font-semibold mb-1">
          How Did You Hear About Us <span aria-hidden="true">*</span>
        </label>
        <select
          id="hearAboutUs"
          name="hearAboutUs"
          value={form.hearAboutUs}
          onChange={handleChange}
          required
          aria-required="true"
          aria-describedby={errors.hearAboutUs ? 'hearAboutUs-error' : undefined}
          aria-invalid={errors.hearAboutUs ? 'true' : undefined}
          className="border border-navy/30 rounded-md px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-terracotta bg-white"
        >
          <option value="">Select an option</option>
          <option value="Social Media">Social Media</option>
          <option value="Friend/Family">Friend/Family</option>
          <option value="Event">Event</option>
          <option value="Other">Other</option>
        </select>
        {errors.hearAboutUs && (
          <p id="hearAboutUs-error" role="alert" className="text-red-600 text-sm mt-1">
            {errors.hearAboutUs}
          </p>
        )}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={submitStatus === 'submitting'}
        className="bg-terracotta text-cream font-bold px-6 py-3 rounded-md min-h-[44px] hover:bg-burgundy focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {submitStatus === 'submitting' ? 'Submitting…' : 'Submit Expression of Interest'}
      </button>
    </form>
  );
}
