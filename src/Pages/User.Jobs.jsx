import React, { useEffect, useState, useRef } from 'react';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import axios from 'axios';
import { BACKEND_HOST } from '@/Utils/constant';
import { MapPin, Briefcase, GraduationCap, DollarSign, Users, Search } from 'lucide-react';
import { ArrowUp } from 'lucide-react';
import { ArrowBigUpDash } from 'lucide-react';

const UserJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${BACKEND_HOST}/api/job/all`);
        const data = await res.data.jobs;
        setJobs(data);
        setFilteredJobs(data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredJobs(jobs);
    } else {
      const filtered = jobs.filter(job =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (job.recruiter?.username?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.location?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.employmentType?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.experienceLevel?.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (job.educationLevel?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredJobs(filtered);
    }
  }, [searchTerm, jobs]);

  if (loading) {
    return (
      <div className="grid gap-4">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="w-full h-40 rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-30 md:ml-30 mx-auto px-4 mb-20">
      <div className="relative w-full flex justify-end">
        <div className="relative max-w-lg ">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            ref={searchInputRef}
            type="search"
            placeholder="Search jobs by title, location, or skills... (Press Cmd+K or Ctrl+K)"
            className="pl-10 pr-20 py-2 rounded-lg w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              {navigator.userAgent.includes('Mac') ? '⌘' : 'Ctrl'} K
            </kbd>
          </div>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <Badge variant="outline" className="mx-auto text-muted-foreground">
          No jobs found matching your search
        </Badge>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {filteredJobs.map((job, idx) => (
            <Card key={idx} className="p-4 transition-shadow h-full">
              <div className="flex flex-col md:flex-row gap-4 h-full">
                <div className="flex-shrink-0">
                  <img 
                    src={job.companyLogo} 
                    alt="Company logo" 
                    className="w-16 h-16 rounded-lg object-contain border p-2"
                  />
                </div>
                
                <div className="flex-1 flex-col">
                  <CardHeader className="p-0 mt-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <CardTitle className="text-lg font-semibold truncate">
                        {job.title || 'Untitled Job'}
                      </CardTitle>
                      <div className="flex items-center gap-1">
                        <img 
                          src={job.recruiter.avatar} 
                          alt="Recruiter avatar" 
                          className="w-8 h-8 rounded-full"
                        />
                        <Badge variant={'outline'} className="text-lg truncate border-none font-normal">
                          @{job.recruiter.username}
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-0 mt-2 grid gap-2">
                    <div className="flex flex-col items-start gap-2">
                      <Badge className="flex items-center gap-1 px-4 py-2">
                        <MapPin className="h-3 w-3" />
                        {job.location || 'Remote'}
                      </Badge>
                      
                      <Badge variant="secondary" className="flex items-center gap-1 px-4 py-2 uppercase">
                        <DollarSign className="h-3 w-3" />
                        {job.salary?.min && job.salary?.max
                          ? `${job.salary.min} - ${job.salary.max} ${job.salary.currency}`
                          : 'Not specified'}
                        {job.salary?.period && (
                          <span className="text-xs ml-1">/ {job.salary.period}</span>
                        )}
                      </Badge>
                      
                      <Badge variant="secondary" className="flex items-center gap-1 px-4 py-2 uppercase">
                        <Users className="h-3 w-3" />
                        Applicants: {job.applied?.length || 0}
                      </Badge>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.employmentType && (
                        <Badge variant="outline" className="flex items-center gap-1 px-4 py-2 uppercase">
                          <Briefcase className="h-3 w-3" />
                          {job.employmentType}
                        </Badge>
                      )}
                      
                      {job.experienceLevel && (
                        <Badge variant="uppercase">
                          <p className='uppercase px-4 py-2'>{job.experienceLevel}</p>
                        </Badge>
                      )}
                      
                      {job.educationLevel && (
                        <Badge variant="outline" className="flex items-center gap-1 px-4 py-2 uppercase">
                          <GraduationCap className="h-3 w-3" />
                          {job.educationLevel}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className={"flex justify-end"}>
                    <button className='w-[200px] flex justify-center items-center gap-2 h-12 mt-10 bg-[#333] text-white uppercase text-sm font-bold'>
                      <ArrowBigUpDash />
                      Apply</button>
                  </CardFooter>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserJobs;