"use client";

import { useActionState } from "react";
import type {
  MeetingFormActionState,
  MeetingFormField,
  SacramentMeeting,
} from "@/lib/types";

type MeetingFormProps = {
  action: (
    previousState: MeetingFormActionState,
    formData: FormData,
  ) => Promise<MeetingFormActionState>;
  meeting?: SacramentMeeting;
  submitLabel: string;
};

const initialState: MeetingFormActionState = {
  message: null,
  errors: {},
};

function speakerLines(meeting?: SacramentMeeting): string {
  return (
    meeting?.speakers
      .map((speaker) => `${speaker.type} | ${speaker.name} | ${speaker.topic}`)
      .join("\n") ?? ""
  );
}

function FieldErrors({
  id,
  errors,
}: {
  id: string;
  errors?: string[];
}) {
  return (
    <div id={id} aria-live="polite" aria-atomic="true">
      {errors?.map((error, index) => (
        <p className="form-error" key={`${error}-${index}`}>
          {error}
        </p>
      ))}
    </div>
  );
}

export default function MeetingForm({
  action,
  meeting,
  submitLabel,
}: MeetingFormProps) {
  const [state, formAction, pending] = useActionState(action, initialState);
  const errors = (field: MeetingFormField) => state.errors?.[field];

  return (
    <form className="meeting-form" action={formAction}>
      <section className="form-section" aria-labelledby="meeting-details">
        <h2 id="meeting-details">Meeting details</h2>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="meeting-date">Date</label>
            <input
              id="meeting-date"
              type="date"
              name="date"
              defaultValue={meeting?.date}
              aria-describedby="meeting-date-error"
              aria-invalid={Boolean(errors("date")?.length)}
              required
            />
            <FieldErrors id="meeting-date-error" errors={errors("date")} />
          </div>
          <div className="form-field">
            <label htmlFor="meeting-type">Meeting type</label>
            <select
              id="meeting-type"
              name="meetingType"
              defaultValue={meeting?.meetingType ?? "regular"}
              aria-describedby="meeting-type-error"
              aria-invalid={Boolean(errors("meetingType")?.length)}
            >
              <option value="regular">Regular</option>
              <option value="testimony">Testimony</option>
              <option value="stake">Stake</option>
              <option value="general">General</option>
            </select>
            <FieldErrors id="meeting-type-error" errors={errors("meetingType")} />
          </div>
          <div className="form-field">
            <label htmlFor="meeting-presiding">Presiding</label>
            <input
              id="meeting-presiding"
              name="presiding"
              defaultValue={meeting?.presiding}
              aria-describedby="meeting-presiding-error"
              aria-invalid={Boolean(errors("presiding")?.length)}
              required
            />
            <FieldErrors
              id="meeting-presiding-error"
              errors={errors("presiding")}
            />
          </div>
          <div className="form-field">
            <label htmlFor="meeting-conducting">Conducting</label>
            <input
              id="meeting-conducting"
              name="conducting"
              defaultValue={meeting?.conducting}
              aria-describedby="meeting-conducting-error"
              aria-invalid={Boolean(errors("conducting")?.length)}
              required
            />
            <FieldErrors
              id="meeting-conducting-error"
              errors={errors("conducting")}
            />
          </div>
        </div>
      </section>

      <section className="form-section" aria-labelledby="opening-program">
        <h2 id="opening-program">Opening program</h2>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="opening-hymn-number">Opening hymn number</label>
            <input
              id="opening-hymn-number"
              type="number"
              name="openingHymnNumber"
              min="1"
              defaultValue={meeting?.openingHymn.number}
              aria-describedby="opening-hymn-number-error"
              aria-invalid={Boolean(errors("openingHymnNumber")?.length)}
              required
            />
            <FieldErrors
              id="opening-hymn-number-error"
              errors={errors("openingHymnNumber")}
            />
          </div>
          <div className="form-field">
            <label htmlFor="opening-hymn-title">Opening hymn title</label>
            <input
              id="opening-hymn-title"
              name="openingHymnTitle"
              defaultValue={meeting?.openingHymn.title}
              aria-describedby="opening-hymn-title-error"
              aria-invalid={Boolean(errors("openingHymnTitle")?.length)}
              required
            />
            <FieldErrors
              id="opening-hymn-title-error"
              errors={errors("openingHymnTitle")}
            />
          </div>
          <div className="form-field form-field-wide">
            <label htmlFor="opening-prayer">Opening prayer</label>
            <input
              id="opening-prayer"
              name="openingPrayer"
              defaultValue={meeting?.openingPrayer}
              aria-describedby="opening-prayer-error"
              aria-invalid={Boolean(errors("openingPrayer")?.length)}
              required
            />
            <FieldErrors
              id="opening-prayer-error"
              errors={errors("openingPrayer")}
            />
          </div>
          <div className="form-field form-field-wide">
            <label htmlFor="announcements">Announcements</label>
            <span className="form-hint" id="announcements-hint">
              One announcement per line
            </span>
            <textarea
              id="announcements"
              name="announcements"
              rows={3}
              defaultValue={meeting?.announcements?.join("\n")}
              aria-describedby="announcements-hint announcements-error"
              aria-invalid={Boolean(errors("announcements")?.length)}
            />
            <FieldErrors
              id="announcements-error"
              errors={errors("announcements")}
            />
          </div>
          <div className="form-field form-field-wide">
            <div className="form-checkbox">
              <input
                id="stake-business"
                type="checkbox"
                name="stakeBusiness"
                defaultChecked={meeting?.stakeBusiness ?? false}
                aria-describedby="stake-business-error"
                aria-invalid={Boolean(errors("stakeBusiness")?.length)}
              />
              <label htmlFor="stake-business">Include stake business</label>
            </div>
            <FieldErrors
              id="stake-business-error"
              errors={errors("stakeBusiness")}
            />
          </div>
          <div className="form-field form-field-wide">
            <label htmlFor="ward-business">Ward business</label>
            <span className="form-hint" id="ward-business-hint">
              One item per line
            </span>
            <textarea
              id="ward-business"
              name="wardBusiness"
              rows={3}
              defaultValue={meeting?.wardBusiness
                .map((item) => item.description)
                .join("\n")}
              aria-describedby="ward-business-hint ward-business-error"
              aria-invalid={Boolean(errors("wardBusiness")?.length)}
            />
            <FieldErrors
              id="ward-business-error"
              errors={errors("wardBusiness")}
            />
          </div>
        </div>
      </section>

      <section className="form-section" aria-labelledby="meeting-program">
        <h2 id="meeting-program">Sacrament and messages</h2>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="sacrament-hymn-number">Sacrament hymn number</label>
            <input
              id="sacrament-hymn-number"
              type="number"
              name="sacramentHymnNumber"
              min="1"
              defaultValue={meeting?.sacramentHymn.number}
              aria-describedby="sacrament-hymn-number-error"
              aria-invalid={Boolean(errors("sacramentHymnNumber")?.length)}
              required
            />
            <FieldErrors
              id="sacrament-hymn-number-error"
              errors={errors("sacramentHymnNumber")}
            />
          </div>
          <div className="form-field">
            <label htmlFor="sacrament-hymn-title">Sacrament hymn title</label>
            <input
              id="sacrament-hymn-title"
              name="sacramentHymnTitle"
              defaultValue={meeting?.sacramentHymn.title}
              aria-describedby="sacrament-hymn-title-error"
              aria-invalid={Boolean(errors("sacramentHymnTitle")?.length)}
              required
            />
            <FieldErrors
              id="sacrament-hymn-title-error"
              errors={errors("sacramentHymnTitle")}
            />
          </div>
          <div className="form-field form-field-wide">
            <label htmlFor="speakers">Speakers and musical numbers</label>
            <span className="form-hint" id="speakers-hint">
              One per line: speaker | name | topic or musical-number | name | topic
            </span>
            <textarea
              id="speakers"
              name="speakers"
              rows={5}
              defaultValue={speakerLines(meeting)}
              aria-describedby="speakers-hint speakers-error"
              aria-invalid={Boolean(errors("speakers")?.length)}
            />
            <FieldErrors id="speakers-error" errors={errors("speakers")} />
          </div>
        </div>
      </section>

      <section className="form-section" aria-labelledby="closing-program">
        <h2 id="closing-program">Closing program</h2>
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="closing-hymn-number">Closing hymn number</label>
            <input
              id="closing-hymn-number"
              type="number"
              name="closingHymnNumber"
              min="1"
              defaultValue={meeting?.closingHymn.number}
              aria-describedby="closing-hymn-number-error"
              aria-invalid={Boolean(errors("closingHymnNumber")?.length)}
              required
            />
            <FieldErrors
              id="closing-hymn-number-error"
              errors={errors("closingHymnNumber")}
            />
          </div>
          <div className="form-field">
            <label htmlFor="closing-hymn-title">Closing hymn title</label>
            <input
              id="closing-hymn-title"
              name="closingHymnTitle"
              defaultValue={meeting?.closingHymn.title}
              aria-describedby="closing-hymn-title-error"
              aria-invalid={Boolean(errors("closingHymnTitle")?.length)}
              required
            />
            <FieldErrors
              id="closing-hymn-title-error"
              errors={errors("closingHymnTitle")}
            />
          </div>
          <div className="form-field form-field-wide">
            <label htmlFor="closing-prayer">Closing prayer</label>
            <input
              id="closing-prayer"
              name="closingPrayer"
              defaultValue={meeting?.closingPrayer}
              aria-describedby="closing-prayer-error"
              aria-invalid={Boolean(errors("closingPrayer")?.length)}
              required
            />
            <FieldErrors
              id="closing-prayer-error"
              errors={errors("closingPrayer")}
            />
          </div>
        </div>
      </section>

      {state.message && (
        <p className="form-error" aria-live="polite" role="status">
          {state.message}
        </p>
      )}
      <button className="button button-dark" type="submit" disabled={pending}>
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}
