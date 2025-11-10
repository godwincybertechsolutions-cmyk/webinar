"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { Room, RoomEvent, RemoteParticipant, RemoteTrack, RemoteTrackPublication } from "livekit-client";
import { supabase } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Video, Mic, MicOff, Camera, CameraOff, MessageSquare, Send, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

interface WebinarRoomProps {
  webinar: any;
  userId: string;
}

export function WebinarRoom({ webinar, userId }: WebinarRoomProps) {
  const [room, setRoom] = useState<Room | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(false);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [participants, setParticipants] = useState<Map<string, RemoteParticipant>>(new Map());
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [transcripts, setTranscripts] = useState<any[]>([]);
  const [showChat, setShowChat] = useState(true);
  const [showQAPanel, setShowQAPanel] = useState(false);
  const [question, setQuestion] = useState("");
  const [qaHistory, setQaHistory] = useState<any[]>([]);
  const videoRefs = useRef<Map<string, HTMLVideoElement>>(new Map());
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const localAudioTrackRef = useRef<any>(null);
  const localVideoTrackRef = useRef<any>(null);

  const connectToRoom = useCallback(async () => {
    try {
      // Get LiveKit token from API
      const response = await fetch("/api/livekit/token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          roomName: webinar.room_name,
          participantName: userId,
          participantIdentity: userId,
          canPublish: webinar.host_id === userId,
          canSubscribe: true,
        }),
      });

      const { token } = await response.json();

      const livekit = await import("livekit-client");
      const newRoom = new livekit.Room({
        publishDefaults: {
          videoSimulcastLayers: [
            livekit.VideoPresets.h720
          ],
        },
      });

      await newRoom.connect(process.env.NEXT_PUBLIC_LIVEKIT_URL!, token);

      newRoom.on(RoomEvent.TrackPublished, (publication, participant) => {
        if (publication.track) {
          handleTrack(publication.track, participant);
        }
      });

      newRoom.on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
        handleTrack(track, participant);
      });

      newRoom.on(RoomEvent.ParticipantConnected, (participant) => {
        setParticipants((prev) => new Map(prev).set(participant.identity, participant));
      });

      newRoom.on(RoomEvent.ParticipantDisconnected, (participant) => {
        setParticipants((prev) => {
          const newMap = new Map(prev);
          newMap.delete(participant.identity);
          return newMap;
        });
      });

      // Enable local audio/video if host
      if (webinar.host_id === userId) {
        await enableLocalMedia(newRoom);
      }

      setRoom(newRoom);
      setIsConnected(true);
    } catch (error) {
      console.error("Failed to connect to room:", error);
      toast.error("Failed to connect to webinar room");
    }
  }, [userId, webinar.host_id, webinar.room_name, enableLocalMedia]);

  const loadChatMessages = useCallback(async () => {
    const { data } = await supabase
      .from("chat_messages")
      .select("*, profiles:user_id(full_name)")
      .eq("webinar_id", webinar.id)
      .order("created_at", { ascending: true })
      .limit(50);

    if (data) setMessages(data);
  }, [webinar.id]);

  const loadTranscripts = useCallback(async () => {
    const { data } = await supabase
      .from("transcripts")
      .select("*")
      .eq("webinar_id", webinar.id)
      .order("timestamp", { ascending: true })
      .limit(100);

    if (data) setTranscripts(data);
  }, [webinar.id]);

  const loadQAHistory = useCallback(async () => {
    const { data } = await supabase
      .from("qa_questions")
      .select("*, profiles:user_id(full_name)")
      .eq("webinar_id", webinar.id)
      .order("created_at", { ascending: false })
      .limit(20);

    if (data) setQaHistory(data);
  }, [webinar.id]);

  const disconnectFromRoom = useCallback(async () => {
    if (room) {
      room.disconnect();
      setIsConnected(false);
    }
  }, [room]);

  useEffect(() => {
    connectToRoom();
    loadChatMessages();
    loadTranscripts();
    loadQAHistory();

    // Subscribe to real-time updates
    const chatSubscription = supabase
      .channel(`chat-${webinar.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "chat_messages", filter: `webinar_id=eq.${webinar.id}` }, (payload) => {
        setMessages((prev) => [...prev, payload.new]);
      })
      .subscribe();

    const transcriptSubscription = supabase
      .channel(`transcript-${webinar.id}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "transcripts", filter: `webinar_id=eq.${webinar.id}` }, (payload) => {
        setTranscripts((prev) => [...prev, payload.new]);
      })
      .subscribe();

    return () => {
      disconnectFromRoom();
      chatSubscription.unsubscribe();
      transcriptSubscription.unsubscribe();
    };
  }, [webinar.id, connectToRoom, disconnectFromRoom, loadChatMessages, loadQAHistory, loadTranscripts]);


  const enableLocalMedia = async (room: Room) => {
    try {
      const { createLocalVideoTrack, createLocalAudioTrack } = await import("livekit-client");
      
      if (isAudioEnabled) {
        const audioTrack = await createLocalAudioTrack();
        localAudioTrackRef.current = audioTrack;
        await room.localParticipant.publishTrack(audioTrack);
      }

      if (isVideoEnabled) {
        const videoTrack = await createLocalVideoTrack();
        localVideoTrackRef.current = videoTrack;
        if (localVideoRef.current) {
          videoTrack.attach(localVideoRef.current);
        }
        await room.localParticipant.publishTrack(videoTrack);
      }
    } catch (error) {
      console.error("Failed to enable local media:", error);
    }
  };

  const handleTrack = (track: RemoteTrack, participant: RemoteParticipant) => {
    if (track.kind === "video") {
      const videoElement = videoRefs.current.get(participant.identity);
      if (videoElement) {
        track.attach(videoElement);
      }
    }
  };


  const toggleVideo = async () => {
    if (!room) return;

    if (isVideoEnabled) {
      if (localVideoTrackRef.current) {
        await room.localParticipant.unpublishTrack(localVideoTrackRef.current);
        localVideoTrackRef.current.detach();
        localVideoTrackRef.current.stop();
      }
    } else {
      const { createLocalVideoTrack } = await import("livekit-client");
      const videoTrack = await createLocalVideoTrack();
      localVideoTrackRef.current = videoTrack;
      if (localVideoRef.current) {
        videoTrack.attach(localVideoRef.current);
      }
      await room.localParticipant.publishTrack(videoTrack);
    }
    setIsVideoEnabled(!isVideoEnabled);
  };

  const toggleAudio = async () => {
    if (!room) return;

    if (isAudioEnabled) {
      if (localAudioTrackRef.current) {
        await room.localParticipant.unpublishTrack(localAudioTrackRef.current);
        localAudioTrackRef.current.stop();
      }
    } else {
      const { createLocalAudioTrack } = await import("livekit-client");
      const audioTrack = await createLocalAudioTrack();
      localAudioTrackRef.current = audioTrack;
      await room.localParticipant.publishTrack(audioTrack);
    }
    setIsAudioEnabled(!isAudioEnabled);
  };

  

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { error } = await supabase.from("chat_messages").insert({
      webinar_id: webinar.id,
      user_id: userId,
      message: newMessage,
    });

    if (error) {
      toast.error("Failed to send message");
    } else {
      setNewMessage("");
    }
  };

  

  

  const askQuestion = async () => {
    if (!question.trim()) return;

    const { data: questionData, error: questionError } = await supabase
      .from("qa_questions")
      .insert({
        webinar_id: webinar.id,
        user_id: userId,
        question: question,
      })
      .select()
      .single();

    if (questionError) {
      toast.error("Failed to submit question");
      return;
    }

    // Get AI answer
    try {
      const response = await fetch("/api/ai/answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          webinarId: webinar.id,
        }),
      });

      const { answer } = await response.json();

      await supabase
        .from("qa_questions")
        .update({ answer, answered_at: new Date().toISOString() })
        .eq("id", questionData.id);

      setQuestion("");
      loadQAHistory();
      toast.success("Question answered!");
    } catch (error) {
      toast.error("Failed to get AI answer");
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">{webinar.title}</h1>
          <p className="text-sm text-gray-400">{participants.size + 1} participants</p>
        </div>
        <div className="flex items-center gap-2">
          {webinar.host_id === userId && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleVideo}
                className={isVideoEnabled ? "" : "bg-red-600"}
              >
                {isVideoEnabled ? <Camera className="h-4 w-4" /> : <CameraOff className="h-4 w-4" />}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleAudio}
                className={isAudioEnabled ? "" : "bg-red-600"}
              >
                {isAudioEnabled ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />}
              </Button>
            </>
          )}
          <Button variant="ghost" size="sm" onClick={() => setShowChat(!showChat)}>
            <MessageSquare className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Video Grid */}
        <div className="flex-1 grid grid-cols-2 gap-2 p-4">
          {webinar.host_id === userId && (
            <div className="relative bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={localVideoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              {!isVideoEnabled && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                  <Video className="h-12 w-12 text-gray-600" />
                </div>
              )}
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">
                You (Host)
              </div>
            </div>
          )}

          {Array.from(participants.values()).map((participant) => (
            <div key={participant.identity} className="relative bg-gray-800 rounded-lg overflow-hidden">
              <video
                ref={(el) => {
                  if (el) videoRefs.current.set(participant.identity, el);
                }}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded text-sm">
                {participant.name || participant.identity}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: 400 }}
              exit={{ width: 0 }}
              className="bg-gray-800 border-l border-gray-700 flex flex-col"
            >
              <div className="p-4 border-b border-gray-700 flex items-center justify-between">
                <h2 className="font-semibold">Chat & Q&A</h2>
                <Button variant="ghost" size="sm" onClick={() => setShowChat(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* Transcripts */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-400">Live Transcript</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {transcripts.slice(-5).map((transcript) => (
                      <div key={transcript.id} className="text-xs bg-gray-700 p-2 rounded">
                        <p className="text-gray-300">{transcript.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chat Messages */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-400">Chat</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {messages.map((msg) => (
                      <div key={msg.id} className="text-sm">
                        <span className="font-semibold">{msg.profiles?.full_name || "User"}:</span>
                        <span className="ml-2">{msg.message}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-2 flex gap-2">
                    <Input
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                      placeholder="Type a message..."
                      className="bg-gray-700 text-white"
                    />
                    <Button size="sm" onClick={sendMessage}>
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Q&A */}
                <div>
                  <h3 className="text-sm font-semibold mb-2 text-gray-400">Ask AI Assistant</h3>
                  <div className="space-y-2 mb-2">
                    <Input
                      value={question}
                      onChange={(e) => setQuestion(e.target.value)}
                      placeholder="Ask a question about the webinar..."
                      className="bg-gray-700 text-white"
                    />
                    <Button size="sm" onClick={askQuestion} className="w-full">
                      Ask Question
                    </Button>
                  </div>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {qaHistory.map((qa) => (
                      <div key={qa.id} className="text-xs bg-gray-700 p-2 rounded">
                        <p className="font-semibold mb-1">Q: {qa.question}</p>
                        {qa.answer && <p className="text-gray-300">A: {qa.answer}</p>}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

