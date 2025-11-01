import { NoteStatus } from "../modules/note/types";

export function getStatusBadgeColor(status: NoteStatus) {
  switch (status) {
    case NoteStatus.OPEN:
      return "yellow";
    case NoteStatus.PAID:
      return "green";
    case NoteStatus.CANCELLED:
      return "red";
    default:
      return "gray";
  }
}

export function getStatusLabel(status: NoteStatus) {
  switch (status) {
    case NoteStatus.OPEN:
      return "Aberta";
    case NoteStatus.PAID:
      return "Paga";
    case NoteStatus.CANCELLED:
      return "Cancelada";
    default:
      return status;
  }
}
