import React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

/**
 * Componente principal do aplicativo de Processamento Digital de Imagens.
 * Permite abrir, exibir, transformar e aplicar filtros em imagens usando React, TypeScript e MUI.
 */
function App() {
  // Estados para controle dos menus superiores
  const [anchorElArquivo, setAnchorElArquivo] =
    React.useState<null | HTMLElement>(null);
  const [anchorElTransf, setAnchorElTransf] =
    React.useState<null | HTMLElement>(null);
  const [anchorElFiltros, setAnchorElFiltros] =
    React.useState<null | HTMLElement>(null);

  // Estado para armazenar a imagem original carregada
  const [imagemOriginal, setImagemOriginal] = React.useState<string | null>(
    null
  );
  // Estado para indicar se a imagem foi modificada (após filtro ou transformação)
  const [imagemModificada, setImagemModificada] =
    React.useState<boolean>(false);
  // Estado para armazenar a imagem transformada/filtrada
  const [imagemTransformada, setImagemTransformada] = React.useState<
    string | null
  >(null);
  // Referência para o canvas oculto usado nas manipulações
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  /**
   * Handler para abrir uma imagem do computador do usuário.
   * Lê o arquivo, converte para base64 e armazena no estado.
   */
  const handleAbrirImagem = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagemOriginal(e.target?.result as string);
        setImagemTransformada(null);
        setImagemModificada(false);
      };
      reader.readAsDataURL(file);
    }
    event.target.value = "";
    setAnchorElArquivo(null);
  };

  /**
   * Handler para remover a imagem carregada e limpar todos os estados relacionados.
   */
  const handleRemoverImagem = () => {
    setImagemOriginal(null);
    setImagemTransformada(null);
    setImagemModificada(false);
    setAnchorElArquivo(null);
  };

  /**
   * Handler para remover apenas as alterações, restaurando a imagem original.
   */
  const handleRemoverAlteracoes = () => {
    setImagemTransformada(null);
    setImagemModificada(false);
    setAnchorElArquivo(null);
  };

  /**
   * Handler para salvar a imagem transformada/filtrada como arquivo PNG.
   */
  const handleSalvarImagem = () => {
    if (imagemTransformada && imagemModificada) {
      const link = document.createElement("a");
      link.href = imagemTransformada;
      link.download = "imagem_transformada.png";
      link.click();
    }
    setAnchorElArquivo(null);
  };

  /**
   * Função utilitária para carregar uma imagem no canvas e executar uma manipulação.
   * @param src Base64 da imagem a ser carregada
   * @param callback Função que recebe o contexto do canvas e a imagem carregada
   */
  const carregarNoCanvas = (
    src: string,
    callback: (ctx: CanvasRenderingContext2D, img: HTMLImageElement) => void
  ) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const img = new window.Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      callback(ctx, img);
      setImagemTransformada(canvas.toDataURL());
      setImagemModificada(true);
    };
    img.src = src;
  };

  /**
   * Handler para transladar (mover) a imagem.
   * Exemplo: desloca 50px para direita e 30px para baixo.
   */
  const handleTransladar = () => {
    if (!imagemOriginal) return;
    carregarNoCanvas(imagemOriginal, (ctx, img) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();
      ctx.translate(50, 30); // valores fixos, pode ser parametrizado
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    });
    setAnchorElTransf(null);
  };

  /**
   * Handler para rotacionar a imagem em 90 graus.
   */
  const handleRotacionar = () => {
    if (!imagemOriginal) return;
    carregarNoCanvas(imagemOriginal, (ctx, img) => {
      const angle = (90 * Math.PI) / 180;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();
      ctx.translate(img.height / 2, img.width / 2);
      ctx.rotate(angle);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();
    });
    setAnchorElTransf(null);
  };

  /**
   * Handler para espelhar a imagem horizontalmente.
   */
  const handleEspelhar = () => {
    if (!imagemOriginal) return;
    carregarNoCanvas(imagemOriginal, (ctx, img) => {
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();
      ctx.translate(img.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    });
    setAnchorElTransf(null);
  };

  /**
   * Handler para aumentar (zoom in) a imagem em 1.5x.
   */
  const handleAumentar = () => {
    if (!imagemOriginal) return;
    carregarNoCanvas(imagemOriginal, (ctx, img) => {
      const scale = 1.5;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    });
    setAnchorElTransf(null);
  };

  /**
   * Handler para diminuir (zoom out) a imagem em 0.5x.
   */
  const handleDiminuir = () => {
    if (!imagemOriginal) return;
    carregarNoCanvas(imagemOriginal, (ctx, img) => {
      const scale = 0.5;
      ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.save();
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      ctx.restore();
    });
    setAnchorElTransf(null);
  };

  /**
   * Handler para aplicar filtro de brilho na imagem.
   * O valor de brilho é fixo para exemplo, mas pode ser parametrizado.
   */
  const handleBrilho = () => {
    if (!imagemOriginal) return;
    carregarNoCanvas(imagemOriginal, (ctx, img) => {
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;
      const brilho = 40; // exemplo: aumenta brilho
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, Math.min(255, data[i] + brilho));
        data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + brilho));
        data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + brilho));
      }
      ctx.putImageData(imageData, 0, 0);
      setImagemTransformada(ctx.canvas.toDataURL());
      setImagemModificada(true);
    });
    setAnchorElFiltros(null);
  };

  /**
   * Handler para aplicar filtro de contraste na imagem.
   * O valor de contraste é fixo para exemplo, mas pode ser parametrizado.
   */
  const handleContraste = () => {
    if (!imagemOriginal) return;
    carregarNoCanvas(imagemOriginal, (ctx, img) => {
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;
      const contraste = 30; // exemplo: aumenta contraste
      const fator = (259 * (contraste + 255)) / (255 * (259 - contraste));
      for (let i = 0; i < data.length; i += 4) {
        data[i] = Math.max(0, Math.min(255, fator * (data[i] - 128) + 128));
        data[i + 1] = Math.max(
          0,
          Math.min(255, fator * (data[i + 1] - 128) + 128)
        );
        data[i + 2] = Math.max(
          0,
          Math.min(255, fator * (data[i + 2] - 128) + 128)
        );
      }
      ctx.putImageData(imageData, 0, 0);
      setImagemTransformada(ctx.canvas.toDataURL());
      setImagemModificada(true);
    });
    setAnchorElFiltros(null);
  };

  /**
   * Handler para aplicar filtro de tons de cinza (grayscale) na imagem.
   */
  const handleGrayscale = () => {
    if (!imagemOriginal) return;
    carregarNoCanvas(imagemOriginal, (ctx, img) => {
      ctx.drawImage(img, 0, 0);
      const imageData = ctx.getImageData(0, 0, img.width, img.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        // Média ponderada: 0.299*R + 0.587*G + 0.114*B
        const gray =
          0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
        data[i] = data[i + 1] = data[i + 2] = gray;
      }
      ctx.putImageData(imageData, 0, 0);
      setImagemTransformada(ctx.canvas.toDataURL());
      setImagemModificada(true);
    });
    setAnchorElFiltros(null);
  };

  /**
   * Abre o menu correspondente ao botão clicado.
   */
  const handleMenuOpen =
    (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) =>
    (event: React.MouseEvent<HTMLElement>) => {
      setter(event.currentTarget);
    };

  /**
   * Fecha o menu correspondente.
   */
  const handleMenuClose =
    (setter: React.Dispatch<React.SetStateAction<HTMLElement | null>>) =>
    () => {
      setter(null);
    };

  // Ref para input file oculto (usado para abrir imagem)
  const inputFileRef = React.useRef<HTMLInputElement>(null);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Processamento Digital de Imagens
          </Typography>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Button
              color="inherit"
              onClick={handleMenuOpen(setAnchorElArquivo)}
            >
              Arquivo
            </Button>
            <Menu
              anchorEl={anchorElArquivo}
              open={Boolean(anchorElArquivo)}
              onClose={handleMenuClose(setAnchorElArquivo)}
            >
              <MenuItem onClick={() => inputFileRef.current?.click()}>
                Abrir imagem
              </MenuItem>
              <MenuItem
                onClick={handleRemoverImagem}
                disabled={!imagemOriginal}
              >
                Remover imagem
              </MenuItem>
              <MenuItem
                onClick={handleRemoverAlteracoes}
                disabled={!imagemTransformada}
              >
                Remover alterações
              </MenuItem>
              <MenuItem
                onClick={handleSalvarImagem}
                disabled={!imagemOriginal || !imagemModificada}
              >
                Salvar imagem
              </MenuItem>
            </Menu>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              ref={inputFileRef}
              onChange={handleAbrirImagem}
            />
            <Button color="inherit" onClick={handleMenuOpen(setAnchorElTransf)}>
              Transformações Geométricas
            </Button>
            <Menu
              anchorEl={anchorElTransf}
              open={Boolean(anchorElTransf)}
              onClose={handleMenuClose(setAnchorElTransf)}
            >
              <MenuItem onClick={handleTransladar} disabled={!imagemOriginal}>
                Transladar
              </MenuItem>
              <MenuItem onClick={handleRotacionar} disabled={!imagemOriginal}>
                Rotacionar
              </MenuItem>
              <MenuItem onClick={handleEspelhar} disabled={!imagemOriginal}>
                Espelhar
              </MenuItem>
              <MenuItem onClick={handleAumentar} disabled={!imagemOriginal}>
                Aumentar
              </MenuItem>
              <MenuItem onClick={handleDiminuir} disabled={!imagemOriginal}>
                Diminuir
              </MenuItem>
            </Menu>
            <Button
              color="inherit"
              onClick={handleMenuOpen(setAnchorElFiltros)}
            >
              Filtros
            </Button>
            <Menu
              anchorEl={anchorElFiltros}
              open={Boolean(anchorElFiltros)}
              onClose={handleMenuClose(setAnchorElFiltros)}
            >
              <MenuItem onClick={handleBrilho}>Brilho</MenuItem>
              <MenuItem onClick={handleContraste}>Contraste</MenuItem>
              <MenuItem onClick={handleGrayscale}>Grayscale</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Box sx={{ display: "flex", justifyContent: "center", gap: 4 }}>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              width: 350,
              height: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fafafa",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {imagemOriginal ? (
              <img
                src={imagemOriginal}
                alt="Imagem Original"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            ) : (
              <Typography variant="subtitle1">Imagem Original</Typography>
            )}
          </Box>
          <Box
            sx={{
              border: "1px solid #ccc",
              borderRadius: 2,
              width: 350,
              height: 350,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#fafafa",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {imagemTransformada ? (
              <img
                src={imagemTransformada}
                alt="Imagem Transformada"
                style={{ maxWidth: "100%", maxHeight: "100%" }}
              />
            ) : (
              <Typography variant="subtitle1">Imagem Transformada</Typography>
            )}
          </Box>
          {/* Canvas oculto para manipulação */}
          <canvas ref={canvasRef} style={{ display: "none" }} />
        </Box>
      </Box>
    </Box>
  );
}

export default App;
