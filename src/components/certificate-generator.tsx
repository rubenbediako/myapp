'use client';

import React, { useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  Share2, 
  Award, 
  Calendar, 
  User, 
  BookOpen,
  Trophy,
  Star,
  Seal
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CertificateData {
  studentName: string;
  courseName: string;
  completionDate: string;
  grade: string;
  percentage: number;
  instructor: string;
  institution: string;
  certificateId: string;
  duration: string;
  skills: string[];
}

interface CertificateGeneratorProps {
  certificateData: CertificateData;
  onDownload?: () => void;
  onShare?: () => void;
}

export function CertificateGenerator({ 
  certificateData, 
  onDownload, 
  onShare 
}: CertificateGeneratorProps) {
  const { toast } = useToast();
  const certificateRef = useRef<HTMLDivElement>(null);

  const generatePDF = async () => {
    try {
      // Dynamic import to avoid SSR issues
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      if (!certificateRef.current) return;

      // Create canvas from certificate
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff'
      });

      // Create PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const imgWidth = 297; // A4 landscape width
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      
      // Save PDF
      const fileName = `${certificateData.courseName.replace(/\s+/g, '_')}_Certificate_${certificateData.studentName.replace(/\s+/g, '_')}.pdf`;
      pdf.save(fileName);

      toast({
        title: "Certificate Downloaded!",
        description: "Your certificate has been saved as a PDF.",
      });

      if (onDownload) onDownload();
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Download Error",
        description: "Failed to generate certificate PDF. Please try again.",
        variant: "destructive"
      });
    }
  };

  const shareLinkedIn = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(
      `I just completed ${certificateData.courseName} with a ${certificateData.percentage}% score! 🎓 #Learning #Economics #Certification`
    );
    
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${url}&text=${text}`,
      '_blank'
    );
    
    if (onShare) onShare();
  };

  const shareTwitter = () => {
    const text = encodeURIComponent(
      `Just earned my certificate in ${certificateData.courseName} with ${certificateData.percentage}% score! 🏆 #Learning #Economics #Achievement`
    );
    
    window.open(
      `https://twitter.com/intent/tweet?text=${text}`,
      '_blank'
    );
    
    if (onShare) onShare();
  };

  return (
    <div className="space-y-6">
      {/* Certificate Preview */}
      <div 
        ref={certificateRef}
        className="certificate-container bg-white p-8 border-8 border-double border-blue-900 relative overflow-hidden"
        style={{ 
          width: '800px', 
          height: '600px',
          margin: '0 auto',
          backgroundImage: `
            radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 50%, rgba(168, 85, 247, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, rgba(59, 130, 246, 0.02) 0%, rgba(168, 85, 247, 0.02) 100%)
          `
        }}
      >
        {/* Decorative corners */}
        <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-gold-500"></div>
        <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-gold-500"></div>
        <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-gold-500"></div>
        <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-gold-500"></div>

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Award className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-2">CERTIFICATE OF COMPLETION</h1>
          <p className="text-lg text-gray-600">{certificateData.institution}</p>
        </div>

        {/* Main Content */}
        <div className="text-center space-y-6">
          <div>
            <p className="text-lg text-gray-700 mb-2">This is to certify that</p>
            <h2 className="text-3xl font-bold text-blue-900 mb-4 border-b-2 border-blue-200 pb-2 inline-block">
              {certificateData.studentName}
            </h2>
          </div>

          <div>
            <p className="text-lg text-gray-700 mb-2">has successfully completed the course</p>
            <h3 className="text-2xl font-semibold text-purple-800 mb-4">
              {certificateData.courseName}
            </h3>
          </div>

          <div className="flex justify-center space-x-8 mb-6">
            <div className="text-center">
              <p className="text-sm text-gray-600">Grade</p>
              <p className="text-xl font-bold text-green-600">{certificateData.grade}</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Score</p>
              <p className="text-xl font-bold text-green-600">{certificateData.percentage}%</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-xl font-bold text-blue-600">{certificateData.duration}</p>
            </div>
          </div>

          {/* Skills */}
          {certificateData.skills.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-600 mb-2">Skills Demonstrated</p>
              <div className="flex flex-wrap justify-center gap-2">
                {certificateData.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="absolute bottom-16 left-0 right-0 flex justify-between items-end px-16">
          <div className="text-center">
            <div className="w-32 border-t-2 border-gray-400 mb-2"></div>
            <p className="text-sm text-gray-600">Instructor</p>
            <p className="font-semibold">{certificateData.instructor}</p>
          </div>
          
          <div className="text-center">
            <Seal className="h-16 w-16 text-blue-600 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Official Seal</p>
          </div>
          
          <div className="text-center">
            <div className="w-32 border-t-2 border-gray-400 mb-2"></div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-semibold">{new Date(certificateData.completionDate).toLocaleDateString()}</p>
          </div>
        </div>

        {/* Certificate ID */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
          <p className="text-xs text-gray-500">Certificate ID: {certificateData.certificateId}</p>
        </div>

        {/* Decorative stars */}
        <Star className="absolute top-16 left-16 h-6 w-6 text-yellow-400 opacity-30" />
        <Star className="absolute top-20 right-20 h-4 w-4 text-yellow-400 opacity-30" />
        <Star className="absolute bottom-20 left-20 h-5 w-5 text-yellow-400 opacity-30" />
        <Star className="absolute bottom-16 right-16 h-6 w-6 text-yellow-400 opacity-30" />
      </div>

      {/* Action Buttons */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-yellow-500" />
            Your Certificate is Ready!
          </CardTitle>
          <CardDescription>
            Download your certificate as PDF or share your achievement
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Download className="h-4 w-4" />
                Download Options
              </h4>
              <div className="space-y-2">
                <Button onClick={generatePDF} className="w-full" size="lg">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF Certificate
                </Button>
                <p className="text-xs text-gray-500">
                  High-quality PDF suitable for printing and professional use
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Share2 className="h-4 w-4" />
                Share Achievement
              </h4>
              <div className="space-y-2">
                <Button onClick={shareLinkedIn} variant="outline" className="w-full">
                  Share on LinkedIn
                </Button>
                <Button onClick={shareTwitter} variant="outline" className="w-full">
                  Share on Twitter
                </Button>
                <p className="text-xs text-gray-500">
                  Let your network know about your achievement
                </p>
              </div>
            </div>
          </div>

          {/* Certificate Details */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="font-semibold mb-3">Certificate Details</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Student</p>
                <p className="font-medium">{certificateData.studentName}</p>
              </div>
              <div>
                <p className="text-gray-600">Course</p>
                <p className="font-medium">{certificateData.courseName}</p>
              </div>
              <div>
                <p className="text-gray-600">Completion Date</p>
                <p className="font-medium">{new Date(certificateData.completionDate).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-gray-600">Final Score</p>
                <p className="font-medium text-green-600">{certificateData.percentage}%</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
