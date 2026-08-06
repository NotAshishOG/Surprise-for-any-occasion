"use client";

import { useState, useRef } from "react";

import { UploadZone } from "./UploadZone";
import { Button } from "./ui/Button";
import { CopyLink } from "./ui/CopyLink";
import { supabase } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { UserVerificationModal } from "./UserVerificationModal";

export function CardForm() {
  const [occasion, setOccasion] = useState("Friendship Day");
  const [customOccasion, setCustomOccasion] = useState("");
  const [name, setName] = useState("");
  const [senderName, setSenderName] = useState("");
  const [message, setMessage] = useState("");
  const [photo1, setPhoto1] = useState<File | null>(null);
  const [photo2, setPhoto2] = useState<File | null>(null);
  const [extraPhotos, setExtraPhotos] = useState<File[]>([]);
  const [balloonPhotos, setBalloonPhotos] = useState<File[]>([]);
  const [musicType, setMusicType] = useState<"link" | "upload">("link");
  const [audioLink, setAudioLink] = useState("");
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedVibe, setSelectedVibe] = useState("🤍 Wholesome");
  const [signatureText, setSignatureText] = useState("designs by joy");
  const [showExtraPhotos, setShowExtraPhotos] = useState(false);
  const [showBalloonPhotos, setShowBalloonPhotos] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const nameOptions = ["Bestie", "Yaar", "Dost", "Bro", "Sis", "Best Friend", "Other"];
  const vibes = ["🤍 Wholesome", "😂 Roast-y & funny", "🙌 Ride-or-die hype", "🌻 Nostalgic"];
  const occasionOptions = ["Friendship Day", "Birthday", "Anniversary", "Valentine's Day", "Custom..."];

  const getOccasionText = () => occasion === "Custom..." ? customOccasion || "Special Day" : occasion;

  const aiClickCount = useRef(0);

  const handleAIWrite = () => {
    aiClickCount.current += 1;
    const currentOccasion = getOccasionText();
    
    const messages: Record<string, string[]> = {
      "😂 Roast-y & funny": [
        `Happy ${currentOccasion} to the only person I'd willingly share my snacks with. You're weird, I'm weird, it works. Don't ever change (mostly because no one else would put up with you). 😂`,
        `Happy ${currentOccasion}! I love that we don't have to say out loud that I'm your favorite friend. It's just understood. 💅`,
        `Happy ${currentOccasion} to my partner in crime. If we ever get caught, you're definitely taking the blame though. 🏃‍♂️💨`,
        `Here's to another year of us laughing at our own jokes and pretending we have our lives together. Happy ${currentOccasion}! 🗑️🔥`
      ],
      "🙌 Ride-or-die hype": [
        `HAPPY ${currentOccasion.toUpperCase()}! 🙌 Just wanted to remind you that you are an absolute legend. Thanks for always matching my energy and hyping me up. We are taking over the world, period.`,
        `Screaming Happy ${currentOccasion} to the baddest out there! 🗣️🔥 You are literally the main character and I'm just happy to be in the cast.`,
        `Happy ${currentOccasion}! Nobody does it like you do. Keep shining, keep slaying, and never let anyone dim your light! 🌟👑`,
        `Happy ${currentOccasion} to my absolute favorite hype person. The energy you bring into a room is unmatched. Let's get it! 🚀`
      ],
      "🌻 Nostalgic": [
        `Happy ${currentOccasion}. 🌻 Thinking about all the crazy memories we've made over the years. Feels like just yesterday we met. So grateful to have you in my corner through it all.`,
        `Happy ${currentOccasion}! I was just looking at our old photos and realizing how much we've grown together. Some things change, but our bond never will. 🍂`,
        `Through every phase, every era, and every questionable haircut... we've survived it all together. Happy ${currentOccasion}. Here's to a lifetime more. 🕰️❤️`,
        `Happy ${currentOccasion}. It's rare to find someone who knows all your stories and has lived through most of them with you. So lucky to call you my friend. 🎞️`
      ],
      "🤍 Wholesome": [
        `Hey ${name || "Best Friend"}. Happy ${currentOccasion}! I don't say this enough, but thank you for being the kind of person who makes hard days lighter and good days unforgettable. Here's to more inside jokes, late-night calls, and everything in between. 🤍`,
        `Happy ${currentOccasion}! Just wanted to remind you how deeply loved and appreciated you are. You make the world a better place just by being in it. 🌸`,
        `To the friend who feels like family, Happy ${currentOccasion}. Thank you for always listening, always caring, and always showing up. 🏡🫂`,
        `Happy ${currentOccasion}! Your friendship is one of the most beautiful gifts I've ever received. I'm endlessly grateful for your kind heart. 🦋`
      ]
    };

    const vibeMessages = messages[selectedVibe] || messages["🤍 Wholesome"];
    const text = vibeMessages[aiClickCount.current % vibeMessages.length];
    setMessage(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !message) {
      setError("Name and message are required.");
      return;
    }

    setError(null);
    setIsModalOpen(true);
  };

  const handleFinalSubmit = async (userInfo: { name: string; email: string; phone: string }) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const uploadId = uuidv4();
      
      const uploadFile = async (file: File, prefix: string): Promise<string> => {
        const safeFilename = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
        const filePath = `${uploadId}/${prefix}-${safeFilename}`;
        
        const { error } = await supabase.storage
          .from('uploads')
          .upload(filePath, file, { cacheControl: '3600', upsert: false });
          
        if (error) throw new Error(`Failed to upload ${file.name}`);
        
        const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
        return data.publicUrl;
      };

      let photo1Url, photo2Url, audioFileUrl;
      const extraPhotoUrls: string[] = [];
      const balloonPhotoUrls: string[] = [];

      if (photo1) photo1Url = await uploadFile(photo1, 'photo1');
      if (photo2) photo2Url = await uploadFile(photo2, 'photo2');
      if (musicType === "upload" && audioFile) audioFileUrl = await uploadFile(audioFile, 'audio');

      for (let i = 0; i < extraPhotos.length; i++) {
        if (extraPhotos[i]) extraPhotoUrls.push(await uploadFile(extraPhotos[i], `extra-${i}`));
      }

      for (let i = 0; i < balloonPhotos.length; i++) {
        if (balloonPhotos[i]) balloonPhotoUrls.push(await uploadFile(balloonPhotos[i], `balloon-${i}`));
      }

      const payload = {
        senderName,
        recipientName: name,
        message,
        occasion: getOccasionText(),
        photo1Url,
        photo2Url,
        audioFileUrl,
        audioLink: musicType === "link" ? audioLink : undefined,
        signatureText: signatureText.trim() || undefined,
        extraPhotoUrls,
        balloonPhotoUrls,
        userInfo
      };

      const res = await fetch("/api/create-card", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create surprise");
      }

      setResultUrl(data.url);
      setIsModalOpen(false);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resultUrl) {
    return (
      <div id="create" className="bg-white rounded-2xl shadow-xl border border-slate-100 relative p-8 text-center max-w-2xl mx-auto flex flex-col items-center mt-12 mb-20 transition-all">
        <div className="text-4xl mb-4 mt-6">🎉</div>
        <h2 className="text-3xl font-bold mb-2">It&apos;s ready 🤝</h2>
        <p className="text-gray-600 mb-6">
          Copy the link below and send it to {name}!
        </p>
        <CopyLink url={resultUrl} />
        
        {typeof navigator !== "undefined" && navigator.share && (
          <Button 
            type="button"
            variant="primary" 
            className="mt-4 w-full sm:w-auto sm:min-w-[280px]"
            onClick={async () => {
              try {
                await navigator.share({
                  title: 'A Surprise For You! 🎁',
                  text: 'I made a special surprise card for you!',
                  url: `${window.location.origin}${resultUrl}`
                });
              } catch (err) {
                console.log('Error sharing', err);
              }
            }}
          >
            📱 Share with {name || "friend"}
          </Button>
        )}

        <Button 
          variant="secondary" 
          className="mt-8"
          onClick={() => {
            setResultUrl(null);
            setName("");
            setSenderName("");
            setMessage("");
            setPhoto1(null);
            setPhoto2(null);
            setExtraPhotos([]);
            setBalloonPhotos([]);
            setAudioLink("");
            setAudioFile(null);
            setSignatureText("designs by joy");
          }}
        >
          Create another one
        </Button>

        {/* Privacy & Expiration Disclaimer */}
        <div className="mt-8 pt-6 border-t-2 border-slate-100 max-w-sm mx-auto text-left">
          <div className="flex items-start gap-3 bg-blue-50/50 p-4 rounded-xl border border-blue-100">
            <span className="text-xl">🛡️</span>
            <div>
              <h4 className="font-bold text-sm text-gray-900 mb-1">Privacy Notice</h4>
              <p className="text-xs text-gray-600 leading-relaxed">
                Your uploaded images are securely stored and will be <strong className="text-gray-900">automatically deleted after 24 hours</strong>. We prioritize your privacy and do not keep your media permanently.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div id="create" className="bg-white rounded-2xl shadow-xl border border-slate-100 relative p-6 md:p-8 max-w-2xl mx-auto text-left mt-12 mb-20 transition-all">
      <form onSubmit={handleSubmit} className="space-y-6 mt-4">
        
        {/* Occasion input */}
        <div>
          <label className="block text-xl font-bold text-gray-900 mb-2 font-sans">
            What&apos;s the occasion?
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {occasionOptions.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setOccasion(opt)}
                className={`px-3 py-1.5 rounded-full border-4 border-black font-bold text-sm transition-all ${occasion === opt ? 'bg-[#34D399] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]' : 'bg-white text-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-y-[1px] hover:-translate-x-[1px]'}`}
              >
                {opt}
              </button>
            ))}
          </div>
          {occasion === "Custom..." && (
            <input
              type="text"
              value={customOccasion}
              onChange={(e) => setCustomOccasion(e.target.value)}
              placeholder="e.g. Graduation, Promotion..."
              className="w-full px-4 py-3 rounded-xl border-4 border-black bg-white focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all font-sans"
              required
              maxLength={30}
            />
          )}
        </div>

        {/* Name input */}
        <div>
          <label htmlFor="name" className="block text-xl font-bold text-gray-900 mb-2 font-sans">
            What do you call them?
          </label>
          <div className="flex flex-wrap gap-2 mb-3">
            {nameOptions.map(opt => (
              <button
                key={opt}
                type="button"
                onClick={() => setName(opt === "Other" ? "" : opt)}
                className={`px-3 py-1.5 rounded-full border-4 border-black font-bold text-sm transition-all ${name === opt ? 'bg-[#34D399] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]' : 'bg-white text-[#1A1A1A] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] hover:-translate-y-[1px] hover:-translate-x-[1px]'}`}
              >
                {opt}
              </button>
            ))}
          </div>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Type a name..."
            className="w-full px-4 py-3 rounded-xl border-4 border-black bg-white focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all font-sans"
            required
            maxLength={50}
          />
        </div>

        {/* Sender Name input */}
        <div>
          <label htmlFor="senderName" className="block text-xl font-bold text-gray-900 mb-2 font-sans">
            Your name
          </label>
          <input
            id="senderName"
            type="text"
            value={senderName}
            onChange={(e) => setSenderName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-3 rounded-xl border-4 border-black bg-white focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all font-sans"
            required
            maxLength={50}
          />
        </div>

        {/* Message textarea */}
        <div>
          <div className="mb-2">
            <label htmlFor="message" className="block text-xl font-bold text-gray-900 font-sans">
              Your little note
            </label>
            <p className="text-gray-600 font-sans text-sm font-medium">Write from the heart</p>
          </div>
          
          <div className="relative">
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Hey Best Friend. Happy Friendship Day!..."
              className="w-full h-40 px-4 py-3 pb-8 rounded-xl border-4 border-black bg-white focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all resize-none font-handwriting text-2xl leading-relaxed"
              required
              maxLength={600}
            />
            <div className={`absolute bottom-3 right-4 text-xs font-bold ${message.length > 550 ? "text-red-600" : "text-gray-500"}`}>
              {message.length}/600
            </div>
          </div>
          
          <div className="mt-4 p-4 border-4 border-black rounded-xl bg-[#F5F5F5] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
            <h4 className="font-bold text-lg mb-1 flex items-center gap-2">
              ✦ AI Write
            </h4>
            <p className="text-sm font-medium text-gray-600 mb-3">Pick a vibe and let AI go</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {vibes.map(vibe => (
                <button
                  key={vibe}
                  type="button"
                  onClick={() => setSelectedVibe(vibe)}
                  className={`px-3 py-1.5 rounded-full border-4 border-black font-bold text-xs transition-all ${selectedVibe === vibe ? 'bg-[#FFD166] text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]' : 'bg-white text-gray-600 border-gray-400 hover:border-black'}`}
                >
                  {vibe}
                </button>
              ))}
            </div>
            <Button
              type="button"
              variant="primary"
              className="w-full py-2 text-sm"
              onClick={handleAIWrite}
            >
              ✦ Write it for me
            </Button>
          </div>
        </div>

        {/* Uploads */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <UploadZone
            label="A photo of you two (optional)"
            fallbackText="Shows up as a small polaroid at the very end of the surprise."
            onFileSelect={setPhoto1}
          />
          <UploadZone
            label="A second photo (optional)"
            fallbackText="Shows up big at the center of the final surprise."
            onFileSelect={setPhoto2}
          />
        </div>
        
        {/* Extra photos */}
        <div className="mt-4">
          {!showExtraPhotos ? (
            <button
              type="button"
              onClick={() => setShowExtraPhotos(true)}
              className="w-full py-4 border-2 border-dashed border-black bg-[#F5F5F5] rounded-xl font-bold hover:bg-[#FFD166] transition-colors"
            >
              + Add up to 4 extra photos (optional)
            </button>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">More memories? Add up to 4 extra photos (optional)</label>
                <button 
                  type="button"
                  onClick={() => setShowExtraPhotos(false)}
                  className="text-sm font-bold text-red-500 hover:underline"
                >
                  Hide
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[0, 1, 2, 3].map((index) => (
                  <UploadZone
                    key={`extra-${index}`}
                    label={`Extra ${index + 1}`}
                    fallbackText="Add to gallery"
                    onFileSelect={(file) => {
                      setExtraPhotos(prev => {
                        const newPhotos = [...prev];
                        if (file) {
                          newPhotos[index] = file;
                        } else {
                          newPhotos.splice(index, 1);
                        }
                        return newPhotos.filter(Boolean); // keep dense array
                      });
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Balloon photos */}
        <div className="mt-4">
          {!showBalloonPhotos ? (
            <button
              type="button"
              onClick={() => setShowBalloonPhotos(true)}
              className="w-full py-4 border-2 border-dashed border-black bg-[#F5F5F5] rounded-xl font-bold hover:bg-[#FFD166] transition-colors"
            >
              + Add custom images for balloons (up to 6, optional)
            </button>
          ) : (
            <>
              <div className="flex justify-between items-center mb-2">
                <label className="block text-sm font-medium text-gray-700">Custom images for the balloon pop (optional)</label>
                <button 
                  type="button"
                  onClick={() => setShowBalloonPhotos(false)}
                  className="text-sm font-bold text-red-500 hover:underline"
                >
                  Hide
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <UploadZone
                    key={`balloon-${index}`}
                    label={`Balloon ${index + 1}`}
                    fallbackText="Image or GIF"
                    onFileSelect={(file) => {
                      setBalloonPhotos(prev => {
                        const newPhotos = [...prev];
                        if (file) {
                          newPhotos[index] = file;
                        } else {
                          newPhotos.splice(index, 1);
                        }
                        return newPhotos.filter(Boolean); // keep dense array
                      });
                    }}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Custom Music */}
        <div className="p-4 border-4 border-black rounded-xl bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
          <h4 className="font-bold text-xl mb-1 flex items-center gap-2">
            🎵 Custom Music (Optional)
          </h4>
          <p className="text-sm font-medium text-gray-600 mb-4">Plays when they open the card!</p>
          
          <div className="flex gap-2 mb-4 border-4 border-black rounded-xl overflow-hidden p-1 bg-[#F5F5F5]">
            <button
              type="button"
              onClick={() => setMusicType("link")}
              className={`flex-1 py-2 font-bold text-sm rounded-lg transition-all border-2 ${musicType === "link" ? "bg-[#34D399] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" : "bg-transparent border-transparent"}`}
            >
              YouTube Link
            </button>
            <button
              type="button"
              onClick={() => setMusicType("upload")}
              className={`flex-1 py-2 font-bold text-sm rounded-lg transition-all border-2 ${musicType === "upload" ? "bg-[#FFD166] border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]" : "bg-transparent border-transparent"}`}
            >
              Upload Audio
            </button>
          </div>

          {musicType === "link" ? (
            <input
              type="text"
              value={audioLink}
              onChange={(e) => setAudioLink(e.target.value)}
              placeholder="Paste YouTube or MP3 link..."
              className="w-full px-4 py-3 rounded-xl border-4 border-black bg-white focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all font-sans"
            />
          ) : (
            <UploadZone
              label="Upload Audio File"
              fallbackText="MP3, WAV, etc."
              onFileSelect={setAudioFile}
              accept="audio/*"
            />
          )}
        </div>

        {/* Signature Text */}
        <div>
          <label htmlFor="signatureText" className="block text-xl font-bold text-gray-900 mb-1 font-sans">
            Polaroid caption ✍️
          </label>
          <p className="text-sm font-medium text-gray-600 mb-2">This shows on the photo at the end</p>
          <input
            id="signatureText"
            type="text"
            value={signatureText}
            onChange={(e) => setSignatureText(e.target.value)}
            placeholder="designs by joy"
            className="w-full px-4 py-3 rounded-xl border-4 border-black bg-white focus:outline-none focus:ring-0 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)] transition-all font-handwriting text-2xl"
            maxLength={50}
          />
        </div>

        {error && (
          <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="pt-8 text-center flex flex-col items-center">
          <Button
            type="submit"
            isLoading={isSubmitting}
            className="w-full sm:w-auto sm:min-w-[280px] py-4 text-xl bg-[#34D399] hover:bg-[#10B981]"
          >
            {isSubmitting ? "Generating preview..." : "🎁 Preview the Surprise 🎉"}
          </Button>
          <p className="mt-4 text-sm font-bold text-gray-500">
            Takes 2 seconds · Free preview · Free to share
          </p>
        </div>

      </form>

      <UserVerificationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFinalSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
