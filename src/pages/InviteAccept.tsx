// Invite acceptance page - /invite/:code
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { acceptProjectInvite } from "@/hooks/useProjectMembers";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, Users } from "lucide-react";

export default function InviteAccept() {
  const { code } = useParams<{ code: string }>();
  const navigate = useNavigate();
  const user = useCurrentUser();
  const [status, setStatus] = useState<"loading" | "success" | "error" | "needsAuth">("loading");
  const [projectId, setProjectId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!code) {
      setStatus("error");
      setErrorMsg("Código de convite inválido");
      return;
    }

    if (!user) {
      setStatus("needsAuth");
      return;
    }

    acceptProjectInvite(code)
      .then((pid) => {
        setProjectId(pid);
        setStatus("success");
      })
      .catch((err) => {
        setStatus("error");
        setErrorMsg(err.message || "Erro ao aceitar convite");
      });
  }, [code, user]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-sm">
        <CardContent className="p-6 text-center space-y-4">
          {status === "loading" && (
            <>
              <Loader2 className="h-10 w-10 animate-spin text-primary mx-auto" />
              <p className="text-muted-foreground">Aceitando convite...</p>
            </>
          )}

          {status === "needsAuth" && (
            <>
              <Users className="h-10 w-10 text-primary mx-auto" />
              <h2 className="text-lg font-semibold">Você precisa fazer login</h2>
              <p className="text-sm text-muted-foreground">
                Faça login ou crie uma conta para aceitar o convite.
              </p>
              <Button onClick={() => navigate(`/app?redirect=/invite/${code}`)}>
                Fazer Login
              </Button>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle2 className="h-10 w-10 text-green-500 mx-auto" />
              <h2 className="text-lg font-semibold">Convite aceito!</h2>
              <p className="text-sm text-muted-foreground">
                Você agora é membro deste projeto.
              </p>
              <Button onClick={() => navigate(`/projects/${projectId}`)}>
                Abrir Projeto
              </Button>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-10 w-10 text-destructive mx-auto" />
              <h2 className="text-lg font-semibold">Erro</h2>
              <p className="text-sm text-muted-foreground">{errorMsg}</p>
              <Button variant="outline" onClick={() => navigate("/app")}>
                Ir para o App
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
