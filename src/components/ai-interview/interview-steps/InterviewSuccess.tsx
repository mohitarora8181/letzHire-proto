import React, { useState } from "react";
import { CheckCircle, Copy, Link } from "lucide-react";

interface InterviewSuccessProps {
  interviewLink: string;
  onInviteCandidates: () => void;
}

export const InterviewSuccess: React.FC<InterviewSuccessProps> = ({
  interviewLink = "https://www.interview.micro.ai/intro/6fa77f87e-5...",
  //   onInviteCandidates,
}) => {
  const [linkCopied, setLinkCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(interviewLink);
      setLinkCopied(true);
      setTimeout(() => setLinkCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="flex items-center space-x-3 text-green-700">
        <CheckCircle className="h-6 w-6" />
        <h3 className="text-xl font-medium">Interview created</h3>
      </div>

      <div className="space-y-6">
        <p className="text-gray-600">
          Now next share the link of the interview with candidates or invite
          them
        </p>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">
            Option 1: Copy below link and send to candidate directly
          </h4>
          <div className="flex items-center space-x-2 bg-blue-50 p-3 rounded-lg">
            <Link className="h-5 w-5 text-blue-600 flex-shrink-0" />
            <span className="text-sm text-blue-900 truncate flex-1">
              {interviewLink}
            </span>
            <button
              onClick={handleCopyLink}
              className="flex items-center px-3 py-1.5 text-sm font-medium text-blue-700 hover:text-blue-800 transition-colors"
            >
              <Copy className="h-4 w-4 mr-1.5" />
              {linkCopied ? "Copied!" : "Copy link"}
            </button>
          </div>
        </div>

        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">
            Option 2: Send an invitation through email, below is the email
            content that will be sent. You can edit it as well
          </h4>
          <div className="bg-gray-50 p-6 rounded-lg space-y-4">
            <div className="space-y-4 text-sm text-gray-600">
              <p>Hi {"{candidate name}"},</p>
              <p>
                The next step of your application at {"{company_name}"} is to
                take an AI Interview.
              </p>
              <p>
                This interview does not require preparation and is meant to
                assess your experience. After you take this, the{" "}
                {"{company_name}"} team will review the results and get back to
                you.
              </p>
              <p className="text-gray-400 text-xs">
                Note: Please open this link on desktop, mobile will not work.
              </p>
              <p className="text-blue-600">Start the AI interview</p>
              <p>Best of luck!</p>
            </div>
          </div>
        </div>

        {/* <button
          onClick={onInviteCandidates}
          className="w-full px-4 py-2.5 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors duration-200"
        >
          Invite candidates
        </button> */}
      </div>
    </div>
  );
};
