export type MicrophonePermissionStatus = "granted" | "denied" | "prompt";

export async function getMicrophonePermissionStatus(): Promise<MicrophonePermissionStatus> {
  try {
    const result = await navigator.permissions.query({
      name: "microphone" as PermissionName,
    });
    return result.state as MicrophonePermissionStatus;
  } catch {
    return "prompt";
  }
}

export async function requestMicrophonePermission(): Promise<boolean> {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    stream.getTracks().forEach((track) => track.stop());
    return true;
  } catch {
    return false;
  }
}
