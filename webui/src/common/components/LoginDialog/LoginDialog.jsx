import {useState, useContext} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faRightToBracket} from '@fortawesome/free-solid-svg-icons';
import Dialog from '@/common/components/Dialog';
import Input from '@/common/components/Input';
import {AuthContext} from '@/common/contexts/Auth';
import toast from 'react-hot-toast';
import './styles.sass';

export const LoginDialog = ({isOpen, onClose, onSuccess}) => {
    const {login} = useContext(AuthContext);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleConfirm = async () => {
        if (!username.trim()) {
            setError('Benutzername ist erforderlich');
            return;
        }
        if (!password) {
            setError('Passwort ist erforderlich');
            return;
        }

        setLoading(true);
        setError('');

        try {
            await login(username.trim(), password);
            toast.success('Erfolgreich angemeldet.');
            setUsername('');
            setPassword('');
            setError('');
            onSuccess?.();
        } catch (err) {
            setError(err.message || 'Anmeldung fehlgeschlagen.');
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setUsername('');
        setPassword('');
        setError('');
        onClose();
    };

    return (
        <Dialog
            isOpen={isOpen}
            onClose={handleClose}
            onConfirm={handleConfirm}
            onCancel={handleClose}
            title={
                <div className="login-dialog-title">
                    <FontAwesomeIcon icon={faRightToBracket} className="login-dialog-title-icon"/>
                    Anmelden
                </div>
            }
            confirmText={loading ? "..." : "Anmelden"}
            cancelText="Abbrechen"
            className="login-dialog"
        >
            <div className="login-dialog-content">
                <p className="login-dialog-text">
                    Bitte melde dich mit deinem <strong>Benutzerkonto</strong> an.
                </p>
                <div className="login-input-wrapper">
                    <Input
                        placeholder="Benutzername"
                        value={username}
                        onChange={(e) => {setUsername(e.target.value); setError('');}}
                        onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                    />
                    <Input
                        type="password"
                        placeholder="Passwort"
                        value={password}
                        onChange={(e) => {setPassword(e.target.value); setError('');}}
                        error={error}
                        onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
                    />
                </div>
            </div>
        </Dialog>
    );
};
