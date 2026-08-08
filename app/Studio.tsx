
"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { DEFAULT_FOCUS, type Drawable, type Focus } from "@/lib/canvas";
import { release } from "@/lib/image";
import { type Member } from "@/lib/render/team";
import type { NameTag } from "@/lib/render/team-group";
import { builderTitle } from "@/lib/titles";
import { COLORWAYS } from "@/lib/tokens";
import { ACCEPT, MAX_TEAM, type FilterPreset, type Mode, type TeamMode } from "./studio/config";
import { useCameraCapture } from "./studio/hooks/useCameraCapture";
import { useImageUpload } from "./studio/hooks/useImageUpload";
import { useImageDrag } from "./studio/hooks/useImageDrag";
import { useNameTags } from "./studio/hooks/useNameTags";
import { usePreviewRender } from "./studio/hooks/usePreviewRender";
import { useExport } from "./studio/hooks/useExport";
import { Header } from "./studio/components/Header";
import { FormatTabs } from "./studio/components/FormatTabs";
import { UploadPanel } from "./studio/components/UploadPanel";
import { ZoomSlider } from "./studio/components/ZoomSlider";
import { ExportControls } from "./studio/components/ExportControls";
import { TeamModeTabs } from "./studio/components/TeamModeTabs";
import { GroupPhotoDropzone } from "./studio/components/GroupPhotoDropzone";
import { PreviewStage } from "./studio/components/PreviewStage";
import { ColorwaySelector } from "./studio/components/ColorwaySelector";
import { FilterSelector } from "./studio/components/FilterSelector";
import { IdFormFields } from "./studio/components/IdFormFields";
import { TeamSlots } from "./studio/components/TeamSlots";
import { NameTagEditor } from "./studio/components/NameTagEditor";
import { RotateControl } from "./studio/components/RotateControl";
import { ShareQrCode } from "./studio/components/ShareQrCode";
import { StatusFooter } from "./studio/components/StatusFooter";
import { Footer } from "./studio/components/Footer";

export default function Studio() {
  const [mode, setMode] = useState<Mode>("pfp");
  const [hasImage, setHasImage] = useState(false);
  const [colorway, setColorway] = useState("genesis");
  const [zoom, setZoom] = useState(1);
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [title, setTitle] = useState("");
  const [teamNames, setTeamNames] = useState("");
  const [teamCount, setTeamCount] = useState(0);
  const [teamMode, setTeamMode] = useState<TeamMode>("individual");
  const [groupHasImage, setGroupHasImage] = useState(false);
  const [groupZoom, setGroupZoom] = useState(1);
  const [groupTags, setGroupTags] = useState<NameTag[]>([]);
  const [renderMs, setRenderMs] = useState<number | null>(null);
  const [filterPreset, setFilterPreset] = useState<FilterPreset>("none");
  const [status, setStatus] = useState<string | null>(null);
  const [manualLink, setManualLink] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const fileRef = useRef<HTMLInputElement>(null);
  const teamFileRef = useRef<HTMLInputElement>(null);
  const groupFileRef = useRef<HTMLInputElement>(null);
  const groupStageRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const imageRef = useRef<Drawable | null>(null);
  const focusRef = useRef<Focus>({ ...DEFAULT_FOCUS });
  const teamRef = useRef<Member[]>([]);
  const groupImageRef = useRef<Drawable | null>(null);
  const groupFocusRef = useRef<Focus>({ ...DEFAULT_FOCUS });
  const streamRef = useRef<MediaStream | null>(null);
  const loopRef = useRef<number | null>(null);

  /* ---------- preview render ---------- */

  const {
    canvasRef,
    rafRef,
    cameraRef,
    paint,
    renderNow,
    scheduleRender,
  } = usePreviewRender({
    mode,
    teamMode,
    colorway,
    name,
    role,
    title,
    teamNames,
    filterPreset,
    groupImageRef,
    groupFocusRef,
    teamRef,
    videoRef,
    imageRef,
    focusRef,
    setRenderMs,
    loopRef,
    streamRef,
  });

  /* ---------- loading photos ---------- */

  const { accept } = useImageUpload({
    imageRef,
    focusRef,
    groupImageRef,
    groupFocusRef,
    teamRef,
    scheduleRender,
    setHasImage,
    setGroupHasImage,
    setZoom,
    setGroupZoom,
    setTeamCount,
    setBusy,
    setStatus,
  });

  /* ---------- camera ---------- */

  const { camera, startCamera, stopCamera, capture } = useCameraCapture({
    videoRef,
    streamRef,
    loopRef,
    focusRef,
    imageRef,
    renderNow,
    scheduleRender,
    setHasImage,
    setStatus,
  });


  // Sync camera boolean to a ref so renderNow can read it without a deps cycle.
  useEffect(() => {
    cameraRef.current = camera;
  }, [camera]);

  /* ---------- export ---------- */

  const { onDownload, onShare, shareUrl } = useExport({
    mode,
    teamMode,
    filterPreset,
    paint,
    camera,
    videoRef,
    imageRef,
    focusRef,
    groupTags,
    setManualLink,
    setBusy,
    setStatus,
  });

  /* ---------- drag to reposition ---------- */

  /* ---------- name tags ---------- */

  const {
    draggingTagId,
    onTagPointerDown,
    onTagPointerMove,
    endTagDrag,
    addTag,
    removeTag,
  } = useNameTags({
    groupStageRef,
    setGroupTags,
  });

  /* ---------- drag to reposition ---------- */

  const {
    onPointerDown,
    onPointerMove,
    endDrag,
    onGroupPointerDown,
    onGroupPointerMove,
    endGroupDrag,
  } = useImageDrag({
    focusRef,
    groupFocusRef,
    scheduleRender,
    hasImage,
    groupHasImage,
    mode,
    draggingTagId,
  });

  const showEditor = hasImage || mode === "team";
  const canAct =
    mode === "team" ? (teamMode === "group" ? groupHasImage : teamCount > 0) : hasImage;

  return (
    <div className="relative z-10 max-w-[560px] mx-auto px-[18px] py-5 pb-16">
      <Header />

      <FormatTabs mode={mode} onChange={(id) => {
        setMode(id);
        setStatus(null);
        setManualLink(null);
      }} />

      {!showEditor && (
        <UploadPanel
          fileRef={fileRef}
          accept={accept}
          startCamera={startCamera}
          status={status}
        />
      )}

      {showEditor && (
        <div className="bg-cream text-ink rounded-[22px] p-[18px] shadow-pink mb-4">
          <p className="font-mono text-[10px] font-bold tracking-[0.16em] uppercase text-pink mb-[10px]">
            {mode === "team" ? "One frame, whole team" : "Step 2 — frame it"}
          </p>

          {mode === "team" && !camera && (
            <TeamModeTabs teamMode={teamMode} onChange={(m) => {
              setTeamMode(m);
              if (m === "individual" && !hasImage) setStatus(null);
            }} />
          )}

          {mode === "team" && teamMode === "group" && !groupHasImage ? (
            <GroupPhotoDropzone
              groupFileRef={groupFileRef}
              accept={accept}
              groupFileOnChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void accept(f, "group");
                e.target.value = "";
              }}
            />
          ) : (
            <PreviewStage
              canvasRef={canvasRef}
              stageRef={groupStageRef}
              onPointerDown={mode === "team" && teamMode === "group" ? onGroupPointerDown : onPointerDown}
              onPointerMove={mode === "team" && teamMode === "group" ? onGroupPointerMove : onPointerMove}
              onPointerUp={mode === "team" && teamMode === "group" ? endGroupDrag : endDrag}
              onPointerCancel={mode === "team" && teamMode === "group" ? endGroupDrag : endDrag}
              showGroupTags={mode === "team" && teamMode === "group" && groupHasImage}
              groupTags={groupTags}
              onTagPointerDown={onTagPointerDown}
              onTagPointerMove={onTagPointerMove}
              onTagPointerUp={endTagDrag}
              onTagPointerCancel={endTagDrag}
              hint={camera ? "Line yourself up" : mode !== "team" ? "Drag to reposition" : mode === "team" && teamMode === "group" && groupHasImage ? "Drag photo · drag tags to move" : null}
              busy={busy}
            />
          )}

          {camera && (
            <div className="grid gap-[10px] mt-4">
              <button className="appearance-none border-0 rounded-xl px-4 py-4 cursor-pointer font-mono text-xs font-bold tracking-[0.1em] uppercase text-center no-underline active:translate-y-px transition-transform duration-120 disabled:opacity-40 disabled:cursor-not-allowed bg-pink text-white" onClick={capture}>
                Take the photo
              </button>
              <button className="appearance-none border-0 rounded-xl px-4 py-3 cursor-pointer font-mono text-xs font-bold tracking-[0.1em] uppercase text-center no-underline active:translate-y-px transition-transform duration-120 disabled:opacity-40 disabled:cursor-not-allowed bg-transparent text-ink/55 border border-green/25" onClick={stopCamera}>
                Cancel
              </button>
            </div>
          )}

          {!camera && mode !== "team" && (
            <>
              <RotateControl
                rotation={focusRef.current.r}
                onChange={(r) => {
                  focusRef.current.r = r;
                  scheduleRender();
                }}
              />
              <ZoomSlider
                id="zoom"
                label="Zoom"
                value={zoom}
                onChange={(z) => {
                  setZoom(z);
                  focusRef.current.z = z;
                  scheduleRender();
                }}
              />
            </>
          )}

          {!camera && mode === "team" && teamMode === "group" && groupHasImage && (
            <>
              <RotateControl
                rotation={groupFocusRef.current.r}
                onChange={(r) => {
                  groupFocusRef.current.r = r;
                  scheduleRender();
                }}
              />
              <ZoomSlider
                id="groupZoom"
                label="Zoom"
                value={groupZoom}
                onChange={(z) => {
                  setGroupZoom(z);
                  groupFocusRef.current.z = z;
                  scheduleRender();
                }}
              />
            </>
          )}

          {!camera && mode !== "team" && (
            <FilterSelector value={filterPreset} onChange={setFilterPreset} />
          )}

          {!camera && mode === "team" && teamMode === "group" && groupHasImage && (
            <FilterSelector value={filterPreset} onChange={setFilterPreset} />
          )}

          {mode === "pfp" && !camera && (
            <ColorwaySelector colorway={colorway} onChange={setColorway} />
          )}

          {mode === "id" && !camera && (
            <IdFormFields
              name={name}
              role={role}
              title={title}
              onNameChange={(v) => setName(v)}
              onRoleChange={(v) => setRole(v)}
              onTitleChange={(v) => setTitle(v)}
              onReroll={() => setTitle(builderTitle(Math.random() + name))}
            />
          )}

          {mode === "team" && teamMode === "individual" && (
            <TeamSlots
              teamCount={teamCount}
              maxTeam={MAX_TEAM}
              onAddSlot={() => teamFileRef.current?.click()}
              onRemoveSlot={(i) => {
                release(teamRef.current[i].img);
                teamRef.current = teamRef.current.filter((_, j) => j !== i);
                setTeamCount(teamRef.current.length);
                scheduleRender();
              }}
              teamNames={teamNames}
              onTeamNamesChange={setTeamNames}
            />
          )}

          {mode === "team" && teamMode === "group" && groupHasImage && (
            <NameTagEditor
              groupTags={groupTags}
              maxTags={MAX_TEAM}
              onTagChange={(id, text) =>
                setGroupTags((prev) => prev.map((t) => (t.id === id ? { ...t, text } : t)))
              }
              onRemoveTag={removeTag}
              onAddTag={addTag}
            />
          )}

          {!camera && (
            <ExportControls
              canAct={canAct}
              onShare={() => void onShare()}
              onDownload={() => void onDownload()}
              onDifferentPhoto={mode !== "team" || (teamMode === "group" && groupHasImage) ? () =>
                mode === "team" ? groupFileRef.current?.click() : fileRef.current?.click()
              : null}
            />
          )}

          <StatusFooter manualLink={manualLink} status={status} renderMs={renderMs} />
          <ShareQrCode shareUrl={shareUrl} />
        </div>
      )}

      <Footer />

      <video ref={videoRef} playsInline muted hidden />
      <input
        ref={fileRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) { setFilterPreset("none"); void accept(f, "solo"); }
          e.target.value = "";
        }}
      />
      <input
        ref={teamFileRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void accept(f, "team");
          e.target.value = "";
        }}
      />
      <input
        ref={groupFileRef}
        type="file"
        accept={ACCEPT}
        hidden
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void accept(f, "group");
          e.target.value = "";
        }}
      />
    </div>
  );
}
