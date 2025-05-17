import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Edit,
  ArrowLeft,
  Users,
  Briefcase,
  MapPin,
  DollarSign,
} from "lucide-react";
import Button from "../components/common/Button";
import Badge from "../components/common/Badge";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

interface JobDetails {
  id: string;
  title: string;
  date: string;
  owner: string;
  applicants: number;
  vetted: number;
  jobType: string[];
  budget: string;
  skills: string[];
  openings: number;
}

const JobDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [job, setJob] = useState<JobDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJob = async () => {
      if (!id) return;

      try {
        const jobDocRef = doc(db, "jobs", id);
        const jobSnap = await getDoc(jobDocRef);

        if (jobSnap.exists()) {
          const data = jobSnap.data();
          setJob({ id: jobSnap.id, ...data } as JobDetails);
        } else {
          console.warn("No such job!");
          setJob(null);
        }
      } catch (err) {
        console.error("Error fetching job:", err);
        setJob(null);
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!job) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-700">Job not found.</p>
        <Link
          to="/jobs"
          className="text-indigo-600 hover:text-indigo-800 font-medium mt-4 inline-block"
        >
          Return to jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link
          to="/jobs"
          className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-4"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to all jobs
        </Link>

        <div className="card p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{job.title}</h1>
              <div className="text-sm text-gray-500 mt-1">
                {job.date} | Owner: {job.owner}
              </div>
            </div>
            <Button variant="secondary" size="sm" className="flex items-center">
              <Edit size={16} className="mr-1" />
              Edit
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
            <InfoItem
              icon={<Briefcase />}
              label="Job Type"
              value={job.jobType.join(", ")}
            />
            {/* You don't have location in your structure, so omit or add fallback */}
            <InfoItem
              icon={<MapPin />}
              label="Location"
              value={"Not specified"}
            />
            <InfoItem icon={<DollarSign />} label="Budget" value={job.budget} />
            <InfoItem
              icon={<Users />}
              label="Openings"
              value={job.openings.toString()}
            />
          </div>

          {/* You do not have description or requirements, so omit or show placeholders */}

          <Section title="Skills">
            <div className="flex flex-wrap gap-2">
              {job.skills.map((skill, i) => (
                <Badge key={i}>{skill}</Badge>
              ))}
            </div>
          </Section>

          <div className="mt-8 py-4 border-t border-gray-200">
            <Button className="w-full">
              Use our AI interviewer to vet your candidates for this job
            </Button>
          </div>
        </div>
      </div>

      {/* You have only a count of applicants, no applicants list */}
      <div className="mb-6 text-gray-500 text-center">
        Applicants count: {job.applicants} | Vetted: {job.vetted}
      </div>
    </div>
  );
};

const InfoItem = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="flex items-center">
    <span className="text-gray-500 mr-2">{icon}</span>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  </div>
);

const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mt-6">
    <h2 className="text-lg font-semibold mb-2">{title}</h2>
    {children}
  </div>
);

export default JobDetailsPage;
