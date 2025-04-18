
import { AlertCircle, CheckCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface StudentRiskAnalysisProps {
  risk: string;
  riskFactors: string[];
}

export const StudentRiskAnalysis = ({ risk, riskFactors }: StudentRiskAnalysisProps) => {
  return (
    <div className="space-y-4">
      <div className="p-4 border rounded-lg">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h3 className="font-semibold text-lg">Risk Assessment</h3>
            <p className="text-sm text-muted-foreground">
              Analysis of student's academic risk factors
            </p>
          </div>
          <Badge className={`text-base py-1 ${
            risk === 'Low' 
              ? 'bg-green-100 text-green-800 hover:bg-green-100' 
              : risk === 'Medium'
                ? 'bg-amber-100 text-amber-800 hover:bg-amber-100'
                : 'bg-red-100 text-red-800 hover:bg-red-100'
          }`}>
            {risk} Risk
          </Badge>
        </div>
      </div>
      
      {riskFactors.length > 0 && riskFactors[0] !== 'None' ? (
        <div className="space-y-3">
          <h3 className="font-medium">Risk Factors:</h3>
          {riskFactors.map((factor, index) => (
            <div key={index} className="p-3 border rounded-lg">
              <div className="flex items-start gap-2">
                <div className="rounded-full bg-red-100 p-1 mt-0.5">
                  <AlertCircle className="h-3 w-3 text-red-600" />
                </div>
                <div>
                  <p className="font-medium">{factor}</p>
                  <p className="text-sm text-muted-foreground">
                    {factor.includes('attendance') 
                      ? 'Poor attendance is correlated with lower academic performance. Consider discussing attendance improvement strategies.' 
                      : factor.includes('internal') 
                        ? 'Low internal marks indicate potential gaps in understanding core concepts. Consider additional support in these areas.'
                        : 'Declining performance may indicate learning difficulties or external factors affecting studies. A personalized approach may be needed.'}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="p-4 border rounded-lg mt-4">
            <h3 className="font-medium mb-2">Recommended Interventions:</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-100 p-1 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </div>
                <span>Schedule a parent-teacher meeting to discuss performance concerns.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-100 p-1 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </div>
                <span>Provide additional resources for subjects with lower performance.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-100 p-1 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </div>
                <span>Assign a peer mentor to support academic improvement.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="rounded-full bg-green-100 p-1 mt-0.5">
                  <CheckCircle className="h-3 w-3 text-green-600" />
                </div>
                <span>Weekly progress checks to monitor improvement.</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="p-6 border rounded-lg text-center">
          <div className="rounded-full bg-green-100 p-3 mx-auto mb-3 w-fit">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No Risk Factors Detected</h3>
          <p className="text-muted-foreground">
            This student is performing well across all academic indicators with no significant risk factors identified.
          </p>
        </div>
      )}
    </div>
  );
};
