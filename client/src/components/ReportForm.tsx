import { useState } from "react";
import { apiFetch } from "../utils.ts";
import "../styles/ReportForm.css";


interface IReportForm {
    title: string;
    description: string;
}

interface IReportFormErrors {
    title?: string;
    description?: string;
}

interface ReportFormProps {
    onClose: () => void;
}

function ReportForm({ onClose }: ReportFormProps) {
    const [formData, setFormData] = useState<IReportForm>({ title: "", description: "" });
    const [errors, setErrors] = useState<IReportFormErrors>({});
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState("");

    const validate = (): IReportFormErrors => {
        const newErrors: IReportFormErrors = {};
        if (!formData.title.trim())
            newErrors.title = "Title is required";
        else if (formData.title.length < 5)
            newErrors.title = "Title must be at least 5 characters";

        if (!formData.description.trim())
            newErrors.description = "Description is required";
        else if (formData.description.length < 10)
            newErrors.description = "Description must be at least 10 characters";

        return newErrors;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const newErrors = validate();
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setError("");

        try {
            const res = await apiFetch("/api/reports", {
                method: "POST",
                body: JSON.stringify({ title: formData.title, description: formData.description }),
            });

            if (!res.ok) {
                setError(await res.text());
                return;
            }

            setSubmitted(true);
        } catch (err) {
            setError("Something went wrong. Please try again. Error: " + err);
        }
    };

    return (
        <div className="report-overlay">
            <div className="report-card" onClick={(e) => { e.stopPropagation()} }>
                <button className="report-close-btn" onClick={onClose} aria-label="Close">&#x2715;</button>
                <h1>Report an Issue</h1>
                {submitted ? (
                    <p className="report-success">Report submitted successfully!</p>
                ) : (
                    <>
                        {error && <p className="report-error">{error}</p>}
                        <form className="report-form" onSubmit={handleSubmit}>
                            <div className="report-field">
                                <label>Username</label>
                                <input
                                    disabled
                                    value={localStorage.getItem("username")}
                                />
                                <label>Title</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => { setFormData({ ...formData, title: e.target.value }); }}
                                />
                                {errors.title && <span className="report-field-error">{errors.title}</span>}
                            </div>

                            <div className="report-field">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => { setFormData({ ...formData, description: e.target.value }); }}
                                />
                                {errors.description && <span className="report-field-error">{errors.description}</span>}
                            </div>

                            <button className="report-btn" type="submit">Submit Report</button>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}


export default ReportForm;