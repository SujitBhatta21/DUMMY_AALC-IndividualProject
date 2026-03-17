import Header from "../components/Header.tsx";
import { useEffect, useState } from "react";
import "../styles/Settings.css";
import { SIZE_MAP } from "../types.ts";
import { FiUser, FiEye, FiInfo, FiCheckCircle } from "react-icons/fi";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import ReportForm from "../components/ReportForm.tsx";
import { apiFetch } from "../utils.ts"


type SettingsPanel = "account" | "accessibility" | "about";

const SPEED_OPTIONS = [
    { label: 'Slow', value: 0.75 },
    { label: 'Normal', value: 1 },
    { label: 'Fast', value: 1.5 },
];

const SIZE_OPTIONS = ['Small', 'Medium', 'Large'];

// Filtering these speech voices from the voice synthesis pool.
const UNPROFESSIONAL_VOICES = [
    'Jester', 'Grandma', 'Granddad', 'Bahh', 'Bells', 'Boing', 'Bubbles',
    'Cellos', 'Good News', 'Hysterical', 'Organ', 'Superstar', 'Trinoids',
    'Whisper', 'Zarvox', 'Bad News', 'Deranged', 'Junior', 'Pipe Organ',
    'Princess', 'Ralph', 'Wobble', 'Xenophone', 'Fred', 'Albert',
];

const NAVIGATION_OPTIONS: { id: SettingsPanel; label: string; icon: React.ReactElement }[] = [
    { id: "account",       label: "Account",       icon: <FiUser /> },
    { id: "accessibility", label: "Accessibility",  icon: <FiEye /> },
    { id: "about",         label: "About",          icon: <FiInfo /> },
];


function AccountPanel() {
    const username = localStorage.getItem("username");
    const userId = localStorage.getItem("userId");
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [passwordSaved, setPasswordSaved] = useState(false);
    const [passwordError, setPasswordError] = useState("");
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClearLocalData = () => {
        localStorage.removeItem('aalc-tts-voice');
        localStorage.removeItem('aalc-tts-rate');
        localStorage.removeItem('aalc-text-size');
    };


    // Method that handles API fetch for change of password.
    const handleChangePasswordSubmit = async () => {
        try {
            const res = await apiFetch(`/api/accounts/${userId}/change_password`, {
                method: "PATCH",
                body: JSON.stringify({ newPassword }),
            });
            if (!res.ok) {
                setPasswordError(await res.text());
                return;
            }
        } catch (error) {
            console.error(error);
        }
    };


    const validatePassword = (password: string): string => {
        if (password.length < 8) return "Password must be at least 8 characters.";
        if (password.length > 16) return "Password must be at most 16 characters.";
        if (!/[A-Z]/.test(password)) return "Password must contain at least one uppercase letter.";
        if (!/[0-9]/.test(password)) return "Password must contain at least one number.";
        return "";
    };

    const handleAccountDeletion = async () =>  {
        try {
            const res = await apiFetch("/api/accounts/delete", {
                method: "DELETE",
                body: JSON.stringify({userId: Number(userId)}),
            });
            if (res.ok) {
                localStorage.clear();
                window.location.href = "/";
            }
        } catch (error) {
            console.error(error);
        }
    }


    return (
        <section>
            <h1>Account</h1>
            <p className="settings-subtitle">Manage your account details</p>

            <div className="settings-section">
                <h2>Username</h2>
                <div className="settings-toggle-row">
                    <span className="settings-row-label">Cannot change username</span>
                    <input
                        id="username-read-only"
                        type="text"
                        value={username ?? ""}
                        className="settings-disabled-username"
                        disabled
                    />
                </div>
            </div>

            <div className="settings-section">
                <h2>Change Password</h2>
                <div className="settings-field">
                    <label htmlFor="current-password">Current Password</label>
                    <div className="password-wrapper">
                        <input
                            id="current-password"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={e => { setCurrentPassword(e.target.value)} }
                            className="settings-input"
                            placeholder="********"
                        />
                        <button type="button" className="icon-btn" aria-label={showCurrentPassword ? "Hide password" : "Show password"} onClick={() => setShowCurrentPassword(p => !p)}>
                            {showCurrentPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                    </div>
                    <label htmlFor="new-password">New Password</label>
                    <div className="password-wrapper">
                        <input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={e => { setNewPassword(e.target.value)} }
                            className="settings-input"
                            placeholder="********"
                        />
                        <button type="button" className="icon-btn" aria-label={showNewPassword ? "Hide password" : "Show password"} onClick={() => setShowNewPassword(p => !p)}>
                            {showNewPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                        </button>
                    </div>
                    <label htmlFor="confirm-password">Confirm New Password</label>
                    <div className="settings-input-row">
                        <div className="password-wrapper">
                            <input
                                id="confirm-password"
                                type={showConfirmPassword ? "text" : "password"}
                                value={confirmPassword}
                                onChange={e => { setConfirmPassword(e.target.value)} }
                                className="settings-input"
                                placeholder="********"
                            />
                            <button type="button" className="icon-btn" aria-label={showConfirmPassword ? "Hide password" : "Show password"} onClick={() => setShowConfirmPassword(p => !p)}>
                                {showConfirmPassword ? <FaRegEye /> : <FaRegEyeSlash />}
                            </button>
                        </div>
                        <button className="settings-btn" onClick={async () => {
                            const validationError = validatePassword(newPassword);
                            if (validationError) {
                                setPasswordError(validationError);
                                setPasswordSaved(false);
                            } else if (newPassword !== confirmPassword) {
                                setPasswordError("Passwords do not match.");
                                setPasswordSaved(false);
                            } else {
                                await handleChangePasswordSubmit();
                                setPasswordError("");
                                setPasswordSaved(true);
                                setTimeout(() => { setPasswordSaved(false) }, 2000);
                            }
                        }}>Save</button>
                    </div>
                    {passwordSaved && <span className="settings-saved">✓ Password saved</span>}
                    {passwordError && <span className="settings-field-error">{passwordError}</span>}
                </div>
            </div>

            <div className="settings-section">
                <h2>Local Data</h2>
                <div className="settings-toggle-row">
                    <div>
                        <span className="settings-row-label">Clear saved preferences</span>
                        <p className="settings-hint">Resets voice, speed, and text size to defaults.</p>
                    </div>
                    <button className="settings-btn settings-btn-outline" onClick={handleClearLocalData}>
                        Clear
                    </button>
                </div>
            </div>

            <div className="settings-section settings-danger-zone">
                <h2>Danger Zone</h2>
                <div className="settings-toggle-row">
                    <div>
                        <span className="settings-row-label">Delete account</span>
                        <p className="settings-hint">Permanently deletes your account and all data. This cannot be undone.</p>
                    </div>
                    <button className="settings-btn settings-btn-danger" onClick={() => { setShowDeleteConfirm(true) }}>
                        Delete Account
                    </button>
                </div>
            </div>

            {showDeleteConfirm && (
                <div className="confirm-overlay" onClick={() => { setShowDeleteConfirm(false)} }>
                    <div className="confirm-dialog" onClick={e => { e.stopPropagation()} }>
                        <h2>Delete account?</h2>
                        <p>This will permanently delete your account and all associated data. This cannot be undone.</p>
                        <div className="confirm-actions">
                            <button className="settings-btn settings-btn-outline" onClick={() => { setShowDeleteConfirm(false)} }>
                                Cancel
                            </button>
                            <button className="settings-btn settings-btn-danger" onClick={ handleAccountDeletion }>
                                Yes, delete my account
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}


function AccessibilityPanel() {
    const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
    const [selectedVoice, setSelectedVoice] = useState(localStorage.getItem('aalc-tts-voice') ?? '');
    const [voiceSaved, setVoiceSaved] = useState(false);
    const [speed, setSpeed] = useState(parseFloat(localStorage.getItem('aalc-tts-rate') ?? '1'));
    const [textSize, setTextSize] = useState(localStorage.getItem('aalc-text-size') ?? 'Medium');
    const [highContrast, setHighContrast] = useState(localStorage.getItem('aalc-high-contrast') === 'true');
    const [reduceMotion, setReduceMotion] = useState(localStorage.getItem('aalc-reduce-motion') === 'true');

    useEffect(() => {
        const load = () => {
            const available = window.speechSynthesis.getVoices()
                .filter(v => v.lang.startsWith('en'))
                .filter(v => !UNPROFESSIONAL_VOICES.some(n => v.name.includes(n)));
            setVoices(available);

            // Setting default voice to Google UK English Female for professional tone.
                // Also, other voices are fallback if the website doesn't offer preffered voices.
            if (!localStorage.getItem('aalc-tts-voice')) {
                const preferred = available.find(v => v.name === 'Google UK English Female')
                               ?? available.find(v => v.name === 'Google UK English Male')
                               ?? available.find(v => v.name === 'Daniel')
                               ?? available.find(v => v.lang === 'en-GB')
                               ?? available[0];
                if (preferred) {
                    setSelectedVoice(preferred.name);
                    localStorage.setItem('aalc-tts-voice', preferred.name);
                }
            }
        };
        load();
        window.speechSynthesis.addEventListener('voiceschanged', load);
        return () => { window.speechSynthesis.removeEventListener('voiceschanged', load) };
    }, []);

    const handleVoiceChange = (name: string) => {
        setSelectedVoice(name);
        localStorage.setItem('aalc-tts-voice', name);
        setVoiceSaved(true);
        setTimeout(() => { setVoiceSaved(false) }, 2000);
    };

    const handleSpeedChange = (value: number) => {
        setSpeed(value);
        localStorage.setItem('aalc-tts-rate', String(value));
    };

    const handleSizeChange = (size: string) => {
        setTextSize(size);
        localStorage.setItem('aalc-text-size', size);
        document.body.style.fontSize = SIZE_MAP[size];
    };

    const handleHighContrast = (val: boolean) => {
        setHighContrast(val);
        localStorage.setItem('aalc-high-contrast', String(val));
        document.body.classList.toggle('high-contrast', val);
    };

    const handleReduceMotion = (val: boolean) => {
        setReduceMotion(val);
        localStorage.setItem('aalc-reduce-motion', String(val));
        document.body.classList.toggle('reduce-motion', val);
    };

    return (
        <section>
            <h1>Accessibility</h1>
            <p className="settings-subtitle">Customise how content is presented to you</p>

            <div className="settings-section">
                <h2>Reading Voice</h2>
                <div className="settings-row">
                    <label htmlFor="voice-select">Voice</label>
                    <select
                        id="voice-select"
                        value={selectedVoice}
                        onChange={e => { handleVoiceChange(e.target.value)} }
                    >
                        <option value="">Default</option>
                        {voices.map(v => (
                            <option key={v.name} value={v.name}>
                                {v.name} ({v.lang})
                            </option>
                        ))}
                    </select>
                    {voiceSaved && <span className="settings-saved"><FiCheckCircle /> Saved</span>}
                </div>
            </div>

            <div className="settings-section">
                <h2>Reading Speed</h2>
                <div className="settings-row">
                    <label>Speed</label>
                    <div className="btn-group">
                        {SPEED_OPTIONS.map(opt => (
                            <button
                                key={opt.value}
                                className={`btn-group-item ${speed === opt.value ? 'active' : ''}`}
                                onClick={() => { handleSpeedChange(opt.value)} }
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h2>Text Size</h2>
                <div className="settings-row">
                    <label>Size</label>
                    <div className="btn-group">
                        {SIZE_OPTIONS.map(size => (
                            <button
                                key={size}
                                className={`btn-group-item ${textSize === size ? 'active' : ''}`}
                                onClick={() => { handleSizeChange(size)} }
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="settings-section">
                <h2>Display</h2>

                <div className="settings-toggle-row">
                    <div>
                        <span className="settings-row-label">High Contrast</span>
                        <p className="settings-hint">Increases visual contrast for easier reading.</p>
                    </div>
                    <label className="toggle-switch" aria-label="Toggle high contrast">
                        <input
                            type="checkbox"
                            checked={highContrast}
                            onChange={e => { handleHighContrast(e.target.checked)} }
                        />
                        <span className="toggle-slider" />
                    </label>
                </div>

                <div className="settings-toggle-row settings-toggle-row--bordered">
                    <div>
                        <span className="settings-row-label">Reduce Motion</span>
                        <p className="settings-hint">Minimises animations and transitions throughout the app.</p>
                    </div>
                    <label className="toggle-switch" aria-label="Toggle reduce motion">
                        <input
                            type="checkbox"
                            checked={reduceMotion}
                            onChange={e => { handleReduceMotion(e.target.checked)} }
                        />
                        <span className="toggle-slider" />
                    </label>
                </div>
            </div>
        </section>
    );
}


function AboutPanel() {
    const [showReport, setShowReport] = useState(false);

    return (
        <section>
            <h1>About</h1>
            <p className="settings-subtitle">AALC Interactive</p>

            <div className="settings-section">
                <h2>App Version</h2>
                <p className="settings-hint">Version 1.0.0</p>
            </div>

            <div className="settings-section">
                <h2>Report a Bug</h2>
                <div className="settings-toggle-row">
                    <span className="settings-row-label">Found an issue? Let us know.</span>
                    <button className="settings-btn" onClick={() => { setShowReport(true)} }>
                        Report Issue
                    </button>
                </div>
            </div>

            <div className="settings-section">
                <h2>Credits</h2>
                <ul className="settings-credits">
                    <li className="settings-credit-item">
                        <span className="credit-role">Development</span>
                        <span className="credit-name">Sujit Bhatta</span>
                    </li>
                    <li className="settings-credit-item">
                        <span className="credit-role">Built with</span>
                        <span className="credit-name">React, TypeScript &amp; Spring Boot</span>
                    </li>
                    <li className="settings-credit-item">
                        <span className="credit-role">Icons</span>
                        <span className="credit-name">react-icons (Feather Icons)</span>
                    </li>
                    <li className="settings-credit-item">
                        <span className="credit-role">Text-to-Speech</span>
                        <span className="credit-name">Web Speech API</span>
                    </li>
                </ul>
            </div>

            {showReport && <ReportForm onClose={() => { setShowReport(false)} } />}
        </section>
    );
}


function Settings() {
    const isLoggedIn = !!localStorage.getItem("token");
    const [activePanel, setActivePanel] = useState<SettingsPanel>("accessibility");

    useEffect(() => {
        document.title = 'Settings | AALC Interactive';
    }, []);

    const visibleOptions = NAVIGATION_OPTIONS.filter(item => item.id !== "account" || isLoggedIn);

    const renderPanel = () => {
        switch (activePanel) {
            case "account":       return isLoggedIn ? <AccountPanel /> : <AccessibilityPanel />;
            case "accessibility": return <AccessibilityPanel />;
            case "about":         return <AboutPanel />;
        }
    };

    return (
        <div>
            <Header />
            <div className="settings-layout">
                <nav className="settings-sidebar">
                    <h2 className="settings-sidebar-title">Settings</h2>
                    {visibleOptions.map(item => (
                        <button
                            key={item.id}
                            className={`settings-sidebar-item ${activePanel === item.id ? "active" : ""}`}
                            onClick={() => { setActivePanel(item.id)} }
                        >
                            {item.icon}
                            {item.label}
                        </button>
                    ))}
                </nav>
                <main className="settings-main">
                    {renderPanel()}
                </main>
            </div>
        </div>
    );
}

export default Settings;