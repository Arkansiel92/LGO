<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\ClanRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: ClanRepository::class)]
#[ApiResource(
    paginationClientItemsPerPage: true,
    order: ["points" => "DESC"],
    normalizationContext: ['groups' => ['clan:read']],
)]
class Clan
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['clan:read', 'membersClan:read'])]
    private ?int $id = null;

    #[ORM\Column(length: 50, unique: true)]
    #[Groups(['clan:read', 'membersClan:read'])]
    private ?string $name = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['clan:read'])]
    private ?string $description = null;

    #[ORM\Column(options: ['default' => 1])]
    #[Groups(['clan:read'])]
    private ?int $points = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['clan:read', 'membersClan:read'])]
    private ?string $banner = null;

    #[ORM\Column(type: Types::TEXT)]
    #[Groups(['clan:read', 'membersClan:read'])]
    private ?string $emblem = null;

    #[ORM\OneToMany(mappedBy: 'clan', targetEntity: MembersClan::class, orphanRemoval: true)]
    #[Groups(['clan:read'])]
    private Collection $membersClans;

    public function __construct()
    {
        $this->points = 0;
        $this->membersClans = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): self
    {
        $this->name = $name;

        return $this;
    }

    public function getDescription(): ?string
    {
        return $this->description;
    }

    public function setDescription(?string $description): self
    {
        $this->description = $description;

        return $this;
    }

    public function getPoints(): ?int
    {
        return $this->points;
    }

    public function setPoints(int $points): self
    {
        $this->points = $points;

        return $this;
    }

    public function getBanner(): ?string
    {
        return $this->banner;
    }

    public function setBanner(string $banner): self
    {
        $this->banner = $banner;

        return $this;
    }

    public function getEmblem(): ?string
    {
        return $this->emblem;
    }

    public function setEmblem(string $emblem): self
    {
        $this->emblem = $emblem;

        return $this;
    }

    /**
     * @return Collection<int, MembersClan>
     */
    public function getMembersClans(): Collection
    {
        return $this->membersClans;
    }

    public function addMembersClan(MembersClan $membersClan): self
    {
        if (!$this->membersClans->contains($membersClan)) {
            $this->membersClans->add($membersClan);
            $membersClan->setClan($this);
        }

        return $this;
    }

    public function removeMembersClan(MembersClan $membersClan): self
    {
        if ($this->membersClans->removeElement($membersClan)) {
            // set the owning side to null (unless already changed)
            if ($membersClan->getClan() === $this) {
                $membersClan->setClan(null);
            }
        }

        return $this;
    }
}
