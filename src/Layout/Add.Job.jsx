import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axios from "axios";
import { BACKEND_HOST } from "@/Utils/constant";
import { uploadToPinata } from "@/Utils/uploadImage";
import { toast } from "sonner";
import { useNavigate } from 'react-router-dom'

const defaultForm = {
  title: '',
  description: '',
  companyLogo: '',
  recruiter: '',
  location: '',
  remote: 'on-site',
  salary: {
    min: '',
    max: '',
    currency: 'USD',
    period: 'annually',
  },
  employmentType: 'full-time',
  skillsRequired: [],
  experienceLevel: 'mid',
  educationLevel: 'bachelor',
  benefits: [],
  tags: [],
  requirements: [],
  responsibilities: [],
  status: 'draft',
  expiresAt: '',
};

const AddJob = () => {
  const [form, setForm] = useState(defaultForm);
  const [users, setUsers] = useState([]);

  const [skillInput, setSkillInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [benefitInput, setBenefitInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [responsibilityInput, setResponsibilityInput] = useState('');

  useEffect(() => {
    axios.get(`${BACKEND_HOST}/api/user/all`)
      .then(res => setUsers(res.data.users || []))
      .catch(err => console.error("Error fetching users:", err));
  }, []);

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSalaryChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      salary: {
        ...prev.salary,
        [field]: value,
      },
    }));
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const imageUrl = await uploadToPinata(file);
      setForm(prev => ({ ...prev, companyLogo: `https://gateway.pinata.cloud/ipfs/${imageUrl.IpfsHash}` }));
    } catch (err) {
      alert("Image upload failed");
    }
  };

  const handleKeyAdd = (e, field, inputValue, setInputValue) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = inputValue.trim();
      if (value && !form[field].includes(value)) {
        setForm(prev => ({ ...prev, [field]: [...prev[field], value] }));
      }
      setInputValue('');
    }
  };

  const handleDelete = (field, index) => {
    setForm(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index),
    }));
  };


  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      const res = await axios.post(`${BACKEND_HOST}/api/job`, form);

      const data = await res.data;
      if (data.success) {
        navigate('/admin/jobs')
        window.location.href = '/admin/jobs'
        toast.success("Job created successfully!");
        setForm(defaultForm);
        setSkillInput('');
        setTagInput('');
        setBenefitInput('');
        setRequirementInput('');
        setResponsibilityInput('');
      } else {
        alert(data.message || 'Error creating job');
      }
    } catch (error) {
        toast.error(error.message)
    }
  };

  const renderChips = (items, field) => (
    <div className="flex flex-wrap gap-2 mb-2">
      {items.map((item, index) => (
        <div key={index} className="flex items-center border px-4 justify-center py-1.5 rounded">
          <span>{item}</span>
          <button
            type="button"
            onClick={() => handleDelete(field, index)}
            className="ml-2 text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-4 mt-20">

      <Input
        placeholder="Job Title"
        value={form.title}
        onChange={e => handleChange('title', e.target.value)}
      />

      <Textarea
        placeholder="Job Description"
        value={form.description}
        onChange={e => handleChange('description', e.target.value)}
      />

      {/* Company Logo Upload */}
<div>
  <label
    htmlFor="logo-upload"
    className="cursor-pointer border border-dashed border-gray-400 rounded-md p-4 w-full text-center flex flex-col items-center justify-center gap-2 hover:bg-gray-50"
  >
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-8 w-8 text-gray-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1M12 12V4m0 0L8 8m4-4l4 4" />
    </svg>
    <span className="text-sm text-gray-600">Click to upload Company Logo</span>
    <input
      id="logo-upload"
      type="file"
      accept="image/*"
      onChange={handleLogoUpload}
      className="hidden"
    />
  </label>

  {form.companyLogo && (
    <div className="mt-4">
      <img
        src={form.companyLogo}
        alt="Uploaded Logo"
        className="w-32 h-32 object-contain border rounded-md mx-auto"
      />
    </div>
  )}
</div>


      <Select value={form.recruiter} onValueChange={val => handleChange('recruiter', val)}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select Recruiter" />
        </SelectTrigger>
        <SelectContent>
          {users.map(user => (
            <SelectItem key={user._id} value={user._id}>
              <div className="flex items-center gap-2">
                <img src={user?.avatar} className="w-[24px] h-[24px] rounded-full" alt="" />
                {user.username || user.name || user.email}
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Input
        placeholder="Location"
        value={form.location}
        onChange={e => handleChange('location', e.target.value)}
      />

      <Select value={form.remote} onValueChange={val => handleChange('remote', val)}>
        <SelectTrigger className="w-full"><SelectValue placeholder="Remote Type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="on-site">On-site</SelectItem>
          <SelectItem value="hybrid">Hybrid</SelectItem>
          <SelectItem value="remote">Remote</SelectItem>
        </SelectContent>
      </Select>

      <div className="grid grid-cols-2 gap-4">
        <Input
          placeholder="Salary Min"
          type="number"
          value={form.salary.min}
          onChange={e => handleSalaryChange('min', e.target.value)}
        />
        <Input
          placeholder="Salary Max"
          type="number"
          value={form.salary.max}
          onChange={e => handleSalaryChange('max', e.target.value)}
        />
        <Input
          placeholder="Currency"
          value={form.salary.currency}
          onChange={e => handleSalaryChange('currency', e.target.value)}
        />
        <Select value={form.salary.period} onValueChange={val => handleSalaryChange('period', val)}>
          <SelectTrigger className="w-full"><SelectValue placeholder="Salary Period" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="hourly">Hourly</SelectItem>
            <SelectItem value="weekly">Weekly</SelectItem>
            <SelectItem value="monthly">Monthly</SelectItem>
            <SelectItem value="annually">Annually</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Select value={form.employmentType} onValueChange={val => handleChange('employmentType', val)}>
        <SelectTrigger className="w-full"><SelectValue placeholder="Employment Type" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="full-time">Full-time</SelectItem>
          <SelectItem value="part-time">Part-time</SelectItem>
          <SelectItem value="contract">Contract</SelectItem>
          <SelectItem value="temporary">Temporary</SelectItem>
          <SelectItem value="internship">Internship</SelectItem>
        </SelectContent>
      </Select>

      <Select value={form.experienceLevel} onValueChange={val => handleChange('experienceLevel', val)}>
        <SelectTrigger className="w-full"><SelectValue placeholder="Experience Level" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="entry">Entry</SelectItem>
          <SelectItem value="mid">Mid</SelectItem>
          <SelectItem value="senior">Senior</SelectItem>
          <SelectItem value="lead">Lead</SelectItem>
          <SelectItem value="executive">Executive</SelectItem>
        </SelectContent>
      </Select>

      <Select value={form.educationLevel} onValueChange={val => handleChange('educationLevel', val)}>
        <SelectTrigger className="w-full"><SelectValue placeholder="Education Level" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="none">None</SelectItem>
          <SelectItem value="high-school">High School</SelectItem>
          <SelectItem value="associate">Associate</SelectItem>
          <SelectItem value="bachelor">Bachelor</SelectItem>
          <SelectItem value="master">Master</SelectItem>
          <SelectItem value="phd">PhD</SelectItem>
        </SelectContent>
      </Select>

      {/* Skills */}
      {renderChips(form.skillsRequired, 'skillsRequired')}
      <Input
        placeholder="Enter skill and press Enter"
        value={skillInput}
        onChange={e => setSkillInput(e.target.value)}
        onKeyDown={e => handleKeyAdd(e, 'skillsRequired', skillInput, setSkillInput)}
      />

      {/* Tags */}
      {renderChips(form.tags, 'tags')}
      <Input
        placeholder="Enter tag and press Enter"
        value={tagInput}
        onChange={e => setTagInput(e.target.value)}
        onKeyDown={e => handleKeyAdd(e, 'tags', tagInput, setTagInput)}
      />

      {/* Benefits */}
      {renderChips(form.benefits, 'benefits')}
      <Input
        placeholder="Enter benefit and press Enter"
        value={benefitInput}
        onChange={e => setBenefitInput(e.target.value)}
        onKeyDown={e => handleKeyAdd(e, 'benefits', benefitInput, setBenefitInput)}
      />

      {/* Requirements */}
      {renderChips(form.requirements, 'requirements')}
      <Input
        placeholder="Enter requirement and press Enter"
        value={requirementInput}
        onChange={e => setRequirementInput(e.target.value)}
        onKeyDown={e => handleKeyAdd(e, 'requirements', requirementInput, setRequirementInput)}
      />

      {/* Responsibilities */}
      {renderChips(form.responsibilities, 'responsibilities')}
      <Input
        placeholder="Enter responsibility and press Enter"
        value={responsibilityInput}
        onChange={e => setResponsibilityInput(e.target.value)}
        onKeyDown={e => handleKeyAdd(e, 'responsibilities', responsibilityInput, setResponsibilityInput)}
      />

      <Select value={form.status} onValueChange={val => handleChange('status', val)}>
        <SelectTrigger className="w-full"><SelectValue placeholder="Job Status" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="draft">Draft</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="paused">Paused</SelectItem>
          <SelectItem value="closed">Closed</SelectItem>
        </SelectContent>
      </Select>

      <Input
        type="date"
        placeholder="Expires At"
        value={form.expiresAt}
        onChange={e => handleChange('expiresAt', e.target.value)}
      />

      <Button onClick={handleSubmit} className="w-full mt-4">
        Submit Job
      </Button>
    </div>
  );
};

export default AddJob;
