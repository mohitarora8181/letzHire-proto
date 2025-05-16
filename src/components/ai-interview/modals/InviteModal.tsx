import React, { useState, useEffect } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
import CandidateForm from "../CandidateForm";
import { db } from "../../../firebase";
import { collection, addDoc } from "firebase/firestore";

interface Candidate {
  name: string;
  email: string;
  id: string;
}

interface InviteModalProps {
  onClose: () => void;
  interviewTitle: string;
  interviewId: string; // New
  onSuccess: (count: number) => void;
}

interface FormErrors {
  [key: string]: {
    name?: string;
    email?: string;
  };
}

const InviteModal: React.FC<InviteModalProps> = ({
  onClose,
  interviewTitle,
  interviewId,
  onSuccess,
}) => {
  const [candidates, setCandidates] = useState<Candidate[]>([
    { id: "1", name: "", email: "" },
  ]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const handleChange = (id: string, field: "name" | "email", value: string) => {
    setCandidates((prev) =>
      prev.map((candidate) =>
        candidate.id === id ? { ...candidate, [field]: value } : candidate
      )
    );

    // Clear errors for this field when user types
    if (errors[id]?.[field]) {
      setErrors((prev) => ({
        ...prev,
        [id]: {
          ...prev[id],
          [field]: undefined,
        },
      }));
    }
  };

  const addCandidate = () => {
    const newId = String(candidates.length + 1);
    setCandidates([...candidates, { id: newId, name: "", email: "" }]);
  };

  const removeCandidate = (id: string) => {
    if (candidates.length > 1) {
      setCandidates(candidates.filter((candidate) => candidate.id !== id));

      // Remove errors for this candidate
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[id];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    candidates.forEach((candidate) => {
      const candidateErrors: { name?: string; email?: string } = {};

      if (!candidate.name.trim()) {
        candidateErrors.name = "Name is required";
        isValid = false;
      }

      if (!candidate.email.trim()) {
        candidateErrors.email = "Email is required";
        isValid = false;
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(candidate.email)) {
        candidateErrors.email = "Please enter a valid email";
        isValid = false;
      }

      if (Object.keys(candidateErrors).length > 0) {
        newErrors[candidate.id] = candidateErrors;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      setIsSubmitting(true);

      try {
        const promises = candidates.map((candidate) =>
          addDoc(collection(db, "interviews", interviewId, "candidates"), {
            name: candidate.name,
            email: candidate.email,
            invitedAt: new Date(),
          })
        );

        await Promise.all(promises);

        setShowSuccess(true);

        setTimeout(() => {
          onSuccess(candidates.length);
        }, 1500);
      } catch (error) {
        console.error("Error inviting candidates:", error);
        alert("Failed to invite candidates. Please try again.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Prevent clicks within the modal from closing it
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 transition-opacity duration-300">
      <div
        className="relative max-w-md w-full mx-4 bg-white rounded-lg shadow-xl animate-fadeInUp"
        onClick={handleModalClick}
      >
        {/* Close button */}
        {!isSubmitting && !showSuccess && (
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        )}

        <div className="p-6">
          {showSuccess ? (
            <div className="text-center py-8 animate-fadeIn">
              <CheckCircle className="mx-auto text-green-500 mb-4" size={48} />
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Candidates invited successfully!
              </h3>
              <p className="text-gray-600 mb-0">
                {candidates.length}{" "}
                {candidates.length === 1 ? "candidate" : "candidates"} has been
                invited to "{interviewTitle}"
              </p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                Enter the name & email of the candidates to invite
              </h2>

              <form onSubmit={handleSubmit}>
                {candidates.map((candidate, index) => (
                  <CandidateForm
                    key={candidate.id}
                    candidate={candidate}
                    onChange={handleChange}
                    onRemove={removeCandidate}
                    showRemoveButton={candidates.length > 1}
                    error={errors[candidate.id]}
                  />
                ))}

                <button
                  type="button"
                  onClick={addCandidate}
                  className="text-blue-600 hover:text-blue-800 text-sm flex items-center mb-6 transition-colors duration-200"
                >
                  + Add another candidate
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-md bg-blue-600 text-white font-medium text-center transition-all duration-200 ${
                    isSubmitting
                      ? "opacity-70 cursor-not-allowed"
                      : "hover:bg-blue-700"
                  }`}
                >
                  {isSubmitting ? (
                    <div className="flex justify-center items-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Processing...
                    </div>
                  ) : (
                    "Invite candidates"
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default InviteModal;
