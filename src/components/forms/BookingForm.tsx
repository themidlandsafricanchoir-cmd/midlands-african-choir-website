import { useState } from 'react';

interface FormState {
  orgName: string;
  email: string;
  phone: string;
  eventType: string;
  eventDate: string;
  eventLocation: string;
  audienceSize: string;
  additionalRequirements: string;
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error';

const PHONE_REGEX = /^\+?[\d\s\-]{7,15}$/;
const EMAIL_REGEX = /[^@]+@[^@]+\.[^@]+/;

const initialFormState: FormState = {
  orgName: '',
  email: '',
  phone: '',
  eventType: '',
  eventDate: '',
  eventLocation: '',
  audienceSize: '',
  additionalRequirements: '',
};

function isFutureDate(dateStr: string): boolean {
  if (!dateStr) return false;
  return new Date(dateStr) > new Date();
}

export default function BookingForm() {
  const [form, setForm] = useState<FormState>(initialFormState);
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [generalError, setGeneralError] = useState<string>('');
  const [apiError, setApiError] = useState<string>('');

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate(): boolean {
    if (!form.orgName.trim()) return false;
    if (!form.email.trim() || !EMAIL_REGEX.test(form.email)) return false;
    if (!form.phone.trim() || !PHONE_REGEX.test(form.phone)) return false;
    if (!form.eventType) return false;
    if (!form.eventDate || !isFutureDate(form.eventDate)) return false;
    if (!form.eventLocation.trim()) return false;
    if (!form.audienceSize) return false;
    return true;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setGeneralError('');
    setApiError('');

    if (!validate()) {
      setGeneralError('Please correct the errors below.');
      return;
    }

    setStatus('submitting');

    try {
      const apiUrl = import.meta.env.PUBLIC_BOOKING_API_URL as string;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('error');
        setApiError('Something went wrong. Please try again or contact us directly.');
      }
    } catch {
      setStatus('error');
      setApiError('Unable to send your enquiry. Please check your connection and try again.');
    }
  }

  if (status === 'success') {
    return (
      <div
        role="alert"
        className="rounded-lg bg-forest/10 border border-forest p-8 text-center text-navy"
      >
        <p className="text-xl font-serif font-semibold text-forest">
          Thank you! Your booking enquiry has been received. We'll respond within 5 business days.
        </p>
      </div>
    );
  }

  const isSubmitting = status === 'submitting';

  // Determine per-field error visibility (only shown after a failed submit attempt)
  const showErrors = generalError !== '';

  const orgNameInvalid = showErrors && !form.orgName.trim();
  const emailInvalid = showErrors && (!form.email.trim() || !EMAIL_REGEX.test(form.email));
  const phoneInvalid = showErrors && (!form.phone.trim() || !PHONE_REGEX.test(form.phone));
  const eventTypeInvalid = showErrors && !form.eventType;
  const eventDateInvalid = showErrors && (!form.eventDate || !isFutureDate(form.eventDate));
  const eventLocationInvalid = showErrors && !form.eventLocation.trim();
  const audienceSizeInvalid = showErrors && !form.audienceSize;

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6"
      aria-label="Booking enquiry form"
    >
      {/* General error banner */}
      {generalError && (
        <div
          role="alert"
          className="rounded-md bg-red-50 border border-red-400 px-4 py-3 text-red-700 text-sm font-medium"
        >
          {generalError}
        </div>
      )}

      {/* Organisation / Name */}
      <div>
        <label
          htmlFor="orgName"
          className="block text-sm font-semibold text-navy mb-1"
        >
          Organisation / Name <span aria-hidden="true" className="text-terracotta">*</span>
        </label>
        <input
          id="orgName"
          name="orgName"
          type="text"
          maxLength={100}
          required
          value={form.orgName}
          onChange={handleChange}
          aria-describedby={orgNameInvalid ? 'orgName-error' : undefined}
          aria-invalid={orgNameInvalid}
          className={`w-full rounded-md border px-3 py-2 text-navy bg-white focus:outline-none focus:ring-2 focus:ring-terracotta ${
            orgNameInvalid ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {orgNameInvalid && (
          <p id="orgName-error" role="alert" className="mt-1 text-sm text-red-600">
            Organisation or name is required.
          </p>
        )}
      </div>

      {/* Email Address */}
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-semibold text-navy mb-1"
        >
          Email Address <span aria-hidden="true" className="text-terracotta">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          value={form.email}
          onChange={handleChange}
          aria-describedby={emailInvalid ? 'email-error' : undefined}
          aria-invalid={emailInvalid}
          className={`w-full rounded-md border px-3 py-2 text-navy bg-white focus:outline-none focus:ring-2 focus:ring-terracotta ${
            emailInvalid ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {emailInvalid && (
          <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
            Please enter a valid email address.
          </p>
        )}
      </div>

      {/* Phone Number */}
      <div>
        <label
          htmlFor="phone"
          className="block text-sm font-semibold text-navy mb-1"
        >
          Phone Number <span aria-hidden="true" className="text-terracotta">*</span>
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          required
          value={form.phone}
          onChange={handleChange}
          aria-describedby={phoneInvalid ? 'phone-error' : undefined}
          aria-invalid={phoneInvalid}
          placeholder="+44 7700 900000"
          className={`w-full rounded-md border px-3 py-2 text-navy bg-white focus:outline-none focus:ring-2 focus:ring-terracotta ${
            phoneInvalid ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {phoneInvalid && (
          <p id="phone-error" role="alert" className="mt-1 text-sm text-red-600">
            Please enter a valid phone number (7–15 digits, optionally with spaces, hyphens, or a leading +).
          </p>
        )}
      </div>

      {/* Event Type */}
      <div>
        <label
          htmlFor="eventType"
          className="block text-sm font-semibold text-navy mb-1"
        >
          Event Type <span aria-hidden="true" className="text-terracotta">*</span>
        </label>
        <select
          id="eventType"
          name="eventType"
          required
          value={form.eventType}
          onChange={handleChange}
          aria-describedby={eventTypeInvalid ? 'eventType-error' : undefined}
          aria-invalid={eventTypeInvalid}
          className={`w-full rounded-md border px-3 py-2 text-navy bg-white focus:outline-none focus:ring-2 focus:ring-terracotta ${
            eventTypeInvalid ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select event type…</option>
          <option value="Wedding">Wedding</option>
          <option value="Corporate">Corporate</option>
          <option value="Festival">Festival</option>
          <option value="Community">Community</option>
          <option value="Religious">Religious</option>
          <option value="Other">Other</option>
        </select>
        {eventTypeInvalid && (
          <p id="eventType-error" role="alert" className="mt-1 text-sm text-red-600">
            Please select an event type.
          </p>
        )}
      </div>

      {/* Event Date */}
      <div>
        <label
          htmlFor="eventDate"
          className="block text-sm font-semibold text-navy mb-1"
        >
          Event Date <span aria-hidden="true" className="text-terracotta">*</span>
        </label>
        <input
          id="eventDate"
          name="eventDate"
          type="date"
          required
          value={form.eventDate}
          onChange={handleChange}
          aria-describedby={eventDateInvalid ? 'eventDate-error' : undefined}
          aria-invalid={eventDateInvalid}
          className={`w-full rounded-md border px-3 py-2 text-navy bg-white focus:outline-none focus:ring-2 focus:ring-terracotta ${
            eventDateInvalid ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {eventDateInvalid && (
          <p id="eventDate-error" role="alert" className="mt-1 text-sm text-red-600">
            Please select a future date (at least 1 day from today).
          </p>
        )}
      </div>

      {/* Event Location */}
      <div>
        <label
          htmlFor="eventLocation"
          className="block text-sm font-semibold text-navy mb-1"
        >
          Event Location <span aria-hidden="true" className="text-terracotta">*</span>
        </label>
        <input
          id="eventLocation"
          name="eventLocation"
          type="text"
          maxLength={200}
          required
          value={form.eventLocation}
          onChange={handleChange}
          aria-describedby={eventLocationInvalid ? 'eventLocation-error' : undefined}
          aria-invalid={eventLocationInvalid}
          className={`w-full rounded-md border px-3 py-2 text-navy bg-white focus:outline-none focus:ring-2 focus:ring-terracotta ${
            eventLocationInvalid ? 'border-red-500' : 'border-gray-300'
          }`}
        />
        {eventLocationInvalid && (
          <p id="eventLocation-error" role="alert" className="mt-1 text-sm text-red-600">
            Event location is required.
          </p>
        )}
      </div>

      {/* Expected Audience Size */}
      <div>
        <label
          htmlFor="audienceSize"
          className="block text-sm font-semibold text-navy mb-1"
        >
          Expected Audience Size <span aria-hidden="true" className="text-terracotta">*</span>
        </label>
        <select
          id="audienceSize"
          name="audienceSize"
          required
          value={form.audienceSize}
          onChange={handleChange}
          aria-describedby={audienceSizeInvalid ? 'audienceSize-error' : undefined}
          aria-invalid={audienceSizeInvalid}
          className={`w-full rounded-md border px-3 py-2 text-navy bg-white focus:outline-none focus:ring-2 focus:ring-terracotta ${
            audienceSizeInvalid ? 'border-red-500' : 'border-gray-300'
          }`}
        >
          <option value="">Select audience size…</option>
          <option value="Under 50">Under 50</option>
          <option value="50–200">50–200</option>
          <option value="200–500">200–500</option>
          <option value="500+">500+</option>
        </select>
        {audienceSizeInvalid && (
          <p id="audienceSize-error" role="alert" className="mt-1 text-sm text-red-600">
            Please select an expected audience size.
          </p>
        )}
      </div>

      {/* Additional Requirements (optional) */}
      <div>
        <label
          htmlFor="additionalRequirements"
          className="block text-sm font-semibold text-navy mb-1"
        >
          Additional Requirements{' '}
          <span className="font-normal text-gray-500">(optional)</span>
        </label>
        <textarea
          id="additionalRequirements"
          name="additionalRequirements"
          maxLength={1000}
          rows={4}
          value={form.additionalRequirements}
          onChange={handleChange}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-navy bg-white focus:outline-none focus:ring-2 focus:ring-terracotta resize-y"
        />
        <p className="mt-1 text-xs text-gray-500">
          {form.additionalRequirements.length}/1000 characters
        </p>
      </div>

      {/* API / network error */}
      {status === 'error' && apiError && (
        <div
          role="alert"
          className="rounded-md bg-red-50 border border-red-400 px-4 py-3 text-red-700 text-sm"
        >
          {apiError}
        </div>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full min-h-[44px] rounded-md bg-terracotta text-cream font-semibold px-6 py-3 hover:bg-terracotta/90 focus:outline-none focus-visible:ring-2 focus-visible:ring-terracotta focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
      >
        {isSubmitting ? 'Sending…' : 'Send Booking Enquiry'}
      </button>
    </form>
  );
}
