"use client";

import { useActionState } from "react";
import { deleteMeeting } from "@/lib/actions";
import type { MeetingFormActionState } from "@/lib/types";

const initialState: MeetingFormActionState = {
  message: null,
  errors: {},
};

export default function DeleteMeetingForm({ id }: { id: number }) {
  const [state, formAction, pending] = useActionState(deleteMeeting, initialState);

  return (
    <form
      action={formAction}
      onSubmit={(event) => {
        if (!window.confirm("Delete this meeting program? This cannot be undone.")) {
          event.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      {state.message && (
        <p className="form-error" role="alert">
          {state.message}
        </p>
      )}
      <button className="button button-danger" type="submit" disabled={pending}>
        {pending ? "Deleting…" : "Delete meeting"}
      </button>
    </form>
  );
}
